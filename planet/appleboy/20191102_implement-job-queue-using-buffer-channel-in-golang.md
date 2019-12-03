---
title: "用 Go 語言 buffered channel 實作 Job Queue"
date: 2019-11-02
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/11/implement-job-queue-using-buffer-channel-in-golang/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/7QKuBYqzmOWPCbAnS6EMG2ypPSeUYU7VEl9sF66zv9cIUCWwErs4CF1qNkWcwKdM7TmR-ygyqWkBvGhPnPQemG1bJl6bxj6ZcNNcS_uecl2xXFXp9qRFJyCqUzYnCfneOPgRPrInO8U=w1920-h1080"><img src="https://lh3.googleusercontent.com/7QKuBYqzmOWPCbAnS6EMG2ypPSeUYU7VEl9sF66zv9cIUCWwErs4CF1qNkWcwKdM7TmR-ygyqWkBvGhPnPQemG1bJl6bxj6ZcNNcS_uecl2xXFXp9qRFJyCqUzYnCfneOPgRPrInO8U=w1920-h1080" alt="" /></a></p>
<p>上個月在高雄 mopcon 講了一場『<a href="https://www.slideshare.net/appleboy/job-queue-in-golang-184064840">Job Queue in Golang</a>』，裡面提到蠻多技術細節，但是要在一場 40 分鐘的演講把大家教會，或者是第一次聽到 <a href="https://golang.org">Go 語言</a>的，可能都很難在 40 分鐘內吸收完畢，所以我打算分好幾篇部落格來分享細部的實作，本篇會講解投影片第 19 ~ 25 頁，透過本篇你可以清楚學到什麼是 <a href="https://tour.golang.org/concurrency/3">buffered channel</a>，以及實作的注意事項。</p>
<span id="more-7534"></span>
<h2>投影片及教學影片</h2>
<iframe src="//www.slideshare.net/slideshow/embed_code/key/yUApXXKrTLWXw2?startSlide=19" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
<p>本篇的實作，也有錄製成教學影片，請參考如下:</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/wvdbobFiXNg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>如果對於課程內容有興趣，可以參考底下課程。</p>
<ul>
<li><a href="https://www.udemy.com/course/golang-fight/?couponCode=GOLANG201911">Go 語言基礎實戰 (開發, 測試及部署)</a></li>
<li><a href="https://www.udemy.com/course/devops-oneday/?couponCode=DEVOPS201911">一天學會 DevOps 自動化測試及部署</a></li>
</ul>
<h2>實際案例</h2>
<p>怎麼透過 buffered channel 來建立簡單的 Queue 機制。請看底下程式碼:</p>
<pre><code class="language-go">func worker(jobChan &lt;-chan Job) {
    for job := range jobChan {
        process(job)
    }
}

// make a channel with a capacity of 1024.
jobChan := make(chan Job, 1024)

// start the worker
go worker(jobChan)

// enqueue a job
jobChan &lt;- job</code></pre>
<p>上面很清楚看到把 worker 丟到背景，接著將 Job 丟進 Channel 內，就可以在背景做一些比較複雜的工作。但是大家看到 <strong>jobChan &lt;- job</strong> 是不是會想到一個問題，這邊會不會 blocking 啊？答案是會的，那你會說可以把 <strong>1024</strong> 調整大一點啊，這我不否認這是一種解法，但是你還是無法保證不會 blocking 啊。底下用一個簡單的例子來說明問題:</p>
<pre><code class="language-go">package main

import (
    &quot;fmt&quot;
    &quot;time&quot;
)

func worker(jobChan &lt;-chan int) {
    for job := range jobChan {
        fmt.Println(&quot;current job:&quot;, job)
        time.Sleep(3 * time.Second)
        fmt.Println(&quot;finished job:&quot;, job)
    }
}

func main() {
    // make a channel with a capacity of 1.
    jobChan := make(chan int, 1)

    // start the worker
    go worker(jobChan)

    // enqueue a job
    fmt.Println(&quot;enqueue the job 1&quot;)
    jobChan &lt;- 1
    fmt.Println(&quot;enqueue the job 2&quot;)
    jobChan &lt;- 2
    fmt.Println(&quot;enqueue the job 3&quot;)
    jobChan &lt;- 3

    fmt.Println(&quot;waiting the jobs&quot;)
    time.Sleep(10 * time.Second)
}</code></pre>
<p>可以到 <a href="https://play.golang.org/p/FWEP93eCaj2">playground</a> 執行上面的例子會輸出什麼？答案如下:</p>
<pre><code class="language-sh">enqueue the job 1
enqueue the job 2
enqueue the job 3
current job: 1 &lt;- 程式被 blocking
finished job: 1
waiting the jobs
current job: 2
finished job: 2
current job: 3
finished job: 3</code></pre>
<p>大家應該都知道這個 main 被 blocking 在 <strong>jobChan &lt;- 3</strong>，因為我們只有設定一個 channel buffer，所以當我們送第一個數字進去 channel 時 (channel buffer 從 0 -&gt; 1)，會馬上被 worker 讀出來 (buffer 從 1 -&gt; 0)，接著送第二個數字進去時，由於 worker 還正在處理第一個 job，所以第二個數字就會被暫時放在 buffer 內，接著送進去第三個數字時 <strong>jobChan &lt;- 3</strong> 這時候會卡在這邊，原因就是 buffer 已經滿了。</p>
<p>這邊有兩種方式來解決主程式被 blocking 的問題，第一個方式很簡單，把丟 Job 的程式碼用 goroutine 丟到背景。也就是改成如下：</p>
<pre><code class="language-go">    fmt.Println(&quot;enqueue the job 3&quot;)
    go func() {
        jobChan &lt;- 3
    }()</code></pre>
<p>另一種方式透過 select 來判斷 Channel 是否可以送資料進去</p>
<pre><code class="language-go">func enqueue(job int, jobChan chan&lt;- int) bool {
    select {
    case jobChan &lt;- job:
        return true
    default:
        return false
    }
}</code></pre>
<p>有了 <strong>enqueue</strong> 之後，就可以知道目前的 Channel 是否可以送資料，也就是可以直接回應給 User，而不是等待被送入，這邊大家要注意的是使用情境，假設你的 Job 是需要被等待的，那這個方式就不適合，如果 Job 是可以丟棄的，就是用此方式回傳 503 或是其他 error code 告訴使用者目前 Queue 已滿。上面例子改寫如下:</p>
<pre><code class="language-go">    fmt.Println(enqueue(1, jobChan)) // true
    fmt.Println(enqueue(2, jobChan)) // true
    fmt.Println(enqueue(3, jobChan)) // false</code></pre>
<p>可以很清楚知道當程式拿到 <strong>false</strong> 時，就可以做相對應處理，而不會卡到主程式，至於該做什麼處理，取決於商業邏輯。所以 buffer channel 要設定多大，以及達到限制時，該做哪些處理，這些都是在使用 buffer channel 時要考慮進去，來避免主程式或者是 goroutine 被 blocking。上述如果不了解的話，可以參考上面 Youtube 影片，會有很詳細的講解。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7330" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/" class="wp_rp_title">用五分鐘了解什麼是 unbuffered vs buffered channel</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="1" data-poid="in-7523" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/job-queue-in-golang/" class="wp_rp_title">用 Go 語言實作 Job Queue 機制</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7384" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/" class="wp_rp_title">15 分鐘學習 Go 語言如何處理多個 Channel 通道</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="4" data-poid="in-7549" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/how-to-define-the-golang-folder-layout/" class="wp_rp_title">初探 Go 語言 Project Layout (新人必看)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7040" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/how-to-write-benchmark-in-go/" class="wp_rp_title">如何在 Go 語言內寫效能測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6708" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/devops-bot-in-golang/" class="wp_rp_title">用 Go 語言打造 DevOps Bot</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6791" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/microservice-in-go/" class="wp_rp_title">用 Go 語言打造微服務架構</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7557" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/four-tips-with-select-in-golang/" class="wp_rp_title">Go 語言使用 Select 四大用法</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>