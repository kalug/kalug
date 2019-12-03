---
title: "15 分鐘學習 Go 語言如何處理多個 Channel 通道"
date: 2019-05-13
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" title="golang logo"><img src="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" alt="golang logo" title="golang logo" /></a></p>
<p>大家在初學 <a href="https://golang.org">Go 語言</a>時，肯定很少用到 Go Channel，也不太確定使用的時機點，其實在官方 Blog 有提供一篇不錯的文章『<a href="https://blog.golang.org/pipelines">Go Concurrency Patterns: Pipelines and cancellation</a>』，相信大家剛跨入學習新語言時，不會馬上看 Go Channel，底下我來用一個簡單的例子來說明如何使用 Go Channel，使用情境非常簡單，就是假設今天要同時處理 20 個背景工作，一定想到要使用 <a href="https://tour.golang.org/concurrency/1">Goroutines</a>，但是又想要收到這 20 個 JOB 處理的結果，並顯示在畫面上，如果其中一個 Job 失敗，就跳出 main 函式，當然又會希望這 20 個 JOB 預期在一分鐘內執行結束，如果超過一分鐘，也是一樣跳出 main 函式。針對這個問題，我們可以整理需要三個 Channel + 一個 Timeout 機制。</p>
<ul>
<li>使用 outChan 顯示各個 JOB 完成狀況</li>
<li>使用 errChan 顯示 JOB 發生錯誤並且跳出 main 主程式</li>
<li>使用 finishChan 通知全部 JOB 已經完成</li>
<li>設定 Timeout 機制 (1 秒之內要完成所有 job)</li>
</ul>
<p>在看此文章之前，也許可以先理解什麼是『<a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/">buffer vs unbuffer channel</a>』。</p>
<span id="more-7384"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Eak_-_9E3Bc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>實戰範例</h2>
<p>針對上述的問題，先透過 Sync 套件的 WaitGroup 來確保 20 個 JOB 處理完成後才結束 main 函式。</p>
<pre><code class="language-go">package main

import (
    &quot;fmt&quot;
    &quot;math/rand&quot;
    &quot;sync&quot;
    &quot;time&quot;
)

func main() {
    wg := sync.WaitGroup{}
    wg.Add(100)
    for i := 0; i &lt; 100; i++ {
        go func(val int, wg *sync.WaitGroup) {
            time.Sleep(time.Duration(rand.Int31n(1000)) * time.Millisecond)
            fmt.Println(&quot;finished job id:&quot;, val)
            wg.Done()
        }(i, &amp;wg)
    }

    wg.Wait()
}</code></pre>
<p>大家可以先拿上面的範例來練習看看如何達到需求，而不是在 go func 內直接印出結果。</p>
<h2>處理多個 Channel 通道</h2>
<p>首先在 main 宣告三個 Channel 通道</p>
<pre><code class="language-go">    outChan := make(chan int)
    errChan := make(chan error)
    finishChan := make(chan struct{})</code></pre>
<p>接著要在最後直接讀取這三個 Channel 值，可以透過 Select，由於 outChan 會傳入 20 個值，所以需要搭配 for 迴圈方式來讀取多個值</p>
<pre><code class="language-go">Loop:
    for {
        select {
        case val := &lt;-outChan:
            fmt.Println(&quot;finished:&quot;, val)
        case err := &lt;-errChan:
            fmt.Println(&quot;error:&quot;, err)
            break Loop
        case &lt;-finishChan:
            break Loop
        }
    }</code></pre>
<p>這邊我們看到需要加上 <code>Loop</code> 自定義 Tag，來達到 break for 迴圈，而不是 break select 函式。但是有沒有發現程式碼會一直卡在 <code>wg.Wait()</code>，不會進入到 for 迴圈內，這時候就必須將 <code>wg.Wait()</code> 丟到背景。</p>
<pre><code class="language-go">    go func() {
        wg.Wait()
        fmt.Println(&quot;finish all job&quot;)
        close(finishChan)
    }()</code></pre>
<p>也就是當 20 個 job 都完成後，會觸發 <code>close(finishChan)</code>，就可以在 for 迴圈內結束整個 main 函式。最後需要設定 timout 機制，請把 select 多補上一個 <code>time.After()</code></p>
<pre><code class="language-go">Loop:
    for {
        select {
        case val := &lt;-outChan:
            fmt.Println(&quot;finished:&quot;, val)
        case err := &lt;-errChan:
            fmt.Println(&quot;error:&quot;, err)
            break Loop
        case &lt;-finishChan:
            break Loop
        case &lt;-time.After(100000 * time.Millisecond):
            break Loop
        }
    }</code></pre>
<p>來看看 go func 內怎麼將值丟到 Channel</p>
<pre><code class="language-go">    for i := 0; i &lt; 20; i++ {
        go func(outChan chan&lt;- int, errChan chan&lt;- error, val int, wg *sync.WaitGroup) {
            defer wg.Done()
            time.Sleep(time.Duration(rand.Int31n(1000)) * time.Millisecond)
            fmt.Println(&quot;finished job id:&quot;, val)
            outChan &lt;- val
            if val == 11 {
                errChan &lt;- errors.New(&quot;error in 60&quot;)
            }

        }(outChan, errChan, i, &amp;wg)
    }</code></pre>
<p>宣告 <code>chan<- int</code> 代表在 go func 只能將訊息丟到通道內，而不能讀取通道。</p>
<h2>心得</h2>
<p>希望透過上述簡單的例子，讓大家初學 Go 的時候有個基礎的理解。用法其實不難，但是請參考專案內容特性來決定如何使用 Channel，最後附上完整的程式碼:</p>
<pre><code class="language-go">package main

import (
    &quot;errors&quot;
    &quot;fmt&quot;
    &quot;math/rand&quot;
    &quot;sync&quot;
    &quot;time&quot;
)

func main() {
    outChan := make(chan int)
    errChan := make(chan error)
    finishChan := make(chan struct{})
    wg := sync.WaitGroup{}
    wg.Add(100)
    for i := 0; i &lt; 100; i++ {
        go func(outChan chan&lt;- int, errChan chan&lt;- error, val int, wg *sync.WaitGroup) {
            defer wg.Done()
            time.Sleep(time.Duration(rand.Int31n(1000)) * time.Millisecond)
            fmt.Println(&quot;finished job id:&quot;, val)
            outChan &lt;- val
            if val == 60 {
                errChan &lt;- errors.New(&quot;error in 60&quot;)
            }

        }(outChan, errChan, i, &amp;wg)
    }

    go func() {
        wg.Wait()
        fmt.Println(&quot;finish all job&quot;)
        close(finishChan)
    }()

Loop:
    for {
        select {
        case val := &lt;-outChan:
            fmt.Println(&quot;finished:&quot;, val)
        case err := &lt;-errChan:
            fmt.Println(&quot;error:&quot;, err)
            break Loop
        case &lt;-finishChan:
            break Loop
        case &lt;-time.After(100000 * time.Millisecond):
            break Loop
        }
    }
}</code></pre>
<p>也可以在 <a href="https://play.golang.org/p/gMwNVc4Ve8b">Go Playground 試試看</a>。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7330" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/" class="wp_rp_title">用五分鐘了解什麼是 unbuffered vs buffered channel</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-7346" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/how-to-load-env-file-in-go/" class="wp_rp_title">用 Go 語言讀取專案內 .env 環境變數</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7376" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/05/what-is-different-between-pointer-and-value-in-golang/" class="wp_rp_title">[Go 語言教學影片] 在 struct 內的 pointers 跟 values 差異</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-6385" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/scaledrone-websocket-from-nodejs-to-go/" class="wp_rp_title">ScaleDrone Websocket 平台從 Node.js 轉換到 Golang</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="5" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="6" data-poid="in-7040" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/how-to-write-benchmark-in-go/" class="wp_rp_title">如何在 Go 語言內寫效能測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7081" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/graphql-go-library-support-concurrent-resolvers/" class="wp_rp_title">Go 語言的 graphQL-go 套件正式支援 Concurrent Resolvers</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7397" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/06/how-to-release-the-v2-or-higher-version-in-go-module/" class="wp_rp_title">Go Module 如何發佈 v2 以上版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7405" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/07/speed-up-go-module-download-using-go-proxy-athens/" class="wp_rp_title">架設 Go Proxy 服務加速 go module 下載速度</a><small class="wp_rp_comments_count"> (7)</small><br /></li></ul></div></div>