---
title: "Go 語言使用 Select 四大用法"
date: 2019-11-23
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/11/four-tips-with-select-in-golang/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/CXyuE0Z1x4_dEciwiP9HRfXD2kHiola3SI-dAsU_HciuBxb3nA_NyZewO70gGlvA59eLapIRAEO0TZbAAx_z85Uqp-OGWx06-3lZ3HilrhnXvbr3nsilF1TcYIhSOtud_G7-wldkZNo=w1920-h1080" title="photo"><img src="https://lh3.googleusercontent.com/CXyuE0Z1x4_dEciwiP9HRfXD2kHiola3SI-dAsU_HciuBxb3nA_NyZewO70gGlvA59eLapIRAEO0TZbAAx_z85Uqp-OGWx06-3lZ3HilrhnXvbr3nsilF1TcYIhSOtud_G7-wldkZNo=w1920-h1080" alt="photo" title="photo" /></a></p>
<p>本篇教學要帶大家認識 <a href="https://golang.org">Go 語言</a>的 <a href="https://tour.golang.org/concurrency/5">Select</a> 用法，相信大家對於 switch 並不陌生，但是 <code>select</code> 跟 <code>switch</code> 有個共同特性就是都過 case 的方式來處理，但是 select 跟 switch 處理的事情完全不同，也完全不相容。來看看 switch 有什麼特性: 各種類型及型別操作，接口 <code>interface{}</code> 型別判斷 <code>variable.(type)</code>，重點是會依照 case <strong>順序依序執行</strong>。底下看個例子:</p>
<span id="more-7557"></span>
<pre><code class="language-go">package main

var (
    i interface{}
)

func convert(i interface{}) {
    switch t := i.(type) {
    case int:
        println(&quot;i is interger&quot;, t)
    case string:
        println(&quot;i is string&quot;, t)
    case float64:
        println(&quot;i is float64&quot;, t)
    default:
        println(&quot;type not found&quot;)
    }
}

func main() {
    i = 100
    convert(i)
    i = float64(45.55)
    convert(i)
    i = &quot;foo&quot;
    convert(i)
    convert(float32(10.0))
}</code></pre>
<p>跑出來的結果如下:</p>
<pre><code class="language-sh">i is interger 100
i is float64 +4.555000e+001
i is string foo
type not found</code></pre>
<p>而 <code>select</code> 的特性就不同了，只能接 channel 否則會出錯，<code>default</code> 會直接執行，所以沒有 <code>default</code> 的 select 就會遇到 blocking，假設沒有送 value 進去 Channel 就會造成 panic，底下拿幾個實際例子來解說。</p>
<h2>教學影片</h2>
<p>此篇部落格內容有錄製成影片放在 Udemy 平台上面，有興趣的可以直接參考底下:</p>
<ul>
<li><a href="https://www.udemy.com/course/golang-fight/?couponCode=20191201">Go 語言基礎實戰 (開發, 測試及部署)</a></li>
<li><a href="https://www.udemy.com/course/devops-oneday/?couponCode=20191201">一天學會 DevOps 自動化測試及部署</a></li>
</ul>
<h2>Random Select</h2>
<p>同一個 channel 在 select 會隨機選取，底下看個例子:</p>
<pre><code class="language-go">package main

import &quot;fmt&quot;

func main() {
    ch := make(chan int, 1)

    ch &lt;- 1
    select {
    case &lt;-ch:
        fmt.Println(&quot;random 01&quot;)
    case &lt;-ch:
        fmt.Println(&quot;random 02&quot;)
    }
}</code></pre>
<p>執行後會發現有時候拿到 <code>random 01</code> 有時候拿到 <code>random 02</code>，這就是 select 的特性之一，case 是隨機選取，所以當 select 有兩個 channel 以上時，如果同時對全部 channel 送資料，則會隨機選取到不同的 Channel。而上面有提到另一個特性『假設沒有送 value 進去 Channel 就會造成 panic』，拿上面例子來改:</p>
<pre><code class="language-go">func main() {
    ch := make(chan int, 1)

    select {
    case &lt;-ch:
        fmt.Println(&quot;random 01&quot;)
    case &lt;-ch:
        fmt.Println(&quot;random 02&quot;)
    }
}</code></pre>
<p>執行後會發現變成 deadlock，造成 main 主程式爆炸，這時候可以直接用 <code>default</code> 方式解決此問題:</p>
<pre><code class="language-go">func main() {
    ch := make(chan int, 1)

    select {
    case &lt;-ch:
        fmt.Println(&quot;random 01&quot;)
    case &lt;-ch:
        fmt.Println(&quot;random 02&quot;)
    default:
        fmt.Println(&quot;exit&quot;)
    }
}</code></pre>
<p>主程式 main 就不會因為讀不到 channel value 造成整個程式 deadlock。</p>
<h2>Timeout 超時機制</h2>
<p>用 select 讀取 channle 時，一定會實作超過一定時間後就做其他事情，而不是一直 blocking 在 select 內。底下是簡單的例子:</p>
<pre><code class="language-go">package main

import (
    &quot;fmt&quot;
    &quot;time&quot;
)

func main() {
    timeout := make(chan bool, 1)
    go func() {
        time.Sleep(2 * time.Second)
        timeout &lt;- true
    }()
    ch := make(chan int)
    select {
    case &lt;-ch:
    case &lt;-timeout:
        fmt.Println(&quot;timeout 01&quot;)
    }
}</code></pre>
<p>建立 timeout channel，讓其他地方可以透過 trigger timeout channel 達到讓 select 執行結束，也或者有另一個寫法是透握 <code>time.After</code> 機制</p>
<pre><code class="language-go">    select {
    case &lt;-ch:
    case &lt;-timeout:
        fmt.Println(&quot;timeout 01&quot;)
    case &lt;-time.After(time.Second * 1):
        fmt.Println(&quot;timeout 02&quot;)
    }</code></pre>
<p>可以注意 <code>time.After</code> 是回傳 <code>chan time.Time</code>，所以執行 select 超過一秒時，就會輸出 <strong>timeout 02</strong>。</p>
<h2>檢查 channel 是否已滿</h2>
<p>直接來看例子比較快:</p>
<pre><code class="language-go">package main

import (
    &quot;fmt&quot;
)

func main() {
    ch := make(chan int, 1)
    ch &lt;- 1
    select {
    case ch &lt;- 2:
        fmt.Println(&quot;channel value is&quot;, &lt;-ch)
        fmt.Println(&quot;channel value is&quot;, &lt;-ch)
    default:
        fmt.Println(&quot;channel blocking&quot;)
    }
}</code></pre>
<p>先宣告 buffer size 為 1 的 channel，先丟值把 channel 填滿。這時候可以透過 <code>select + default</code> 方式來確保 channel 是否已滿，上面例子會輸出 <strong>channel blocking</strong>，我們再把程式改成底下</p>
<pre><code class="language-go">func main() {
    ch := make(chan int, 2)
    ch &lt;- 1
    select {
    case ch &lt;- 2:
        fmt.Println(&quot;channel value is&quot;, &lt;-ch)
        fmt.Println(&quot;channel value is&quot;, &lt;-ch)
    default:
        fmt.Println(&quot;channel blocking&quot;)
    }
}</code></pre>
<p>把 buffer size 改為 2 後，就可以繼續在塞 value 進去 channel 了，這邊的 buffer channel 觀念可以看之前的文章『<a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/">用五分鐘了解什麼是 unbuffered vs buffered channel</a>』</p>
<h2>select for loop 用法</h2>
<p>如果你有多個 channel 需要讀取，而讀取是不間斷的，就必須使用 for + select 機制來實現，更詳細的實作可以參考『<a href="https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/" title="15 分鐘學習 Go 語言如何處理多個 Channel 通道">15 分鐘學習 Go 語言如何處理多個 Channel 通道</a>』</p>
<pre><code class="language-go">package main

import (
    &quot;fmt&quot;
    &quot;time&quot;
)

func main() {
    i := 0
    ch := make(chan string, 0)
    defer func() {
        close(ch)
    }()

    go func() {
    LOOP:
        for {
            time.Sleep(1 * time.Second)
            fmt.Println(time.Now().Unix())
            i++

            select {
            case m := &lt;-ch:
                println(m)
                break LOOP
            default:
            }
        }
    }()

    time.Sleep(time.Second * 4)
    ch &lt;- &quot;stop&quot;
}</code></pre>
<p>上面例子可以發現執行後如下:</p>
<pre><code class="language-sh">1574474619
1574474620
1574474621
1574474622</code></pre>
<p>其實把 <code>default</code> 拿掉也可以達到目的</p>
<pre><code class="language-go">select {
case m := &lt;-ch:
    println(m)
    break LOOP</code></pre>
<p>當沒有值送進來時，就會一直停在 select 區段，所以其實沒有 <code>default</code> 也是可以正常運作的，而要結束 for 或 select 都需要透過 break 來結束，但是要在 select 區間直接結束掉 for 迴圈，只能使用 <code>break variable</code> 來結束，這邊是大家需要注意的地方。</p>
<div class="wp_rp_wrap  wp_rp_plain" id="wp_rp_first"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7534" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/implement-job-queue-using-buffer-channel-in-golang/" class="wp_rp_title">用 Go 語言 buffered channel 實作 Job Queue</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7523" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/job-queue-in-golang/" class="wp_rp_title">用 Go 語言實作 Job Queue 機制</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6721" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/" class="wp_rp_title">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="4" data-poid="in-7330" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/" class="wp_rp_title">用五分鐘了解什麼是 unbuffered vs buffered channel</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="5" data-poid="in-7384" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/" class="wp_rp_title">15 分鐘學習 Go 語言如何處理多個 Channel 通道</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="6" data-poid="in-7549" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/how-to-define-the-golang-folder-layout/" class="wp_rp_title">初探 Go 語言 Project Layout (新人必看)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7040" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/how-to-write-benchmark-in-go/" class="wp_rp_title">如何在 Go 語言內寫效能測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7376" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/05/what-is-different-between-pointer-and-value-in-golang/" class="wp_rp_title">[Go 語言教學影片] 在 struct 內的 pointers 跟 values 差異</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>