---
title: "[Go 語言教學影片] 在 struct 內的 pointers 跟 values 差異"
date: 2019-05-06
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/05/what-is-different-between-pointer-and-value-in-golang/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" title="golang logo"><img src="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" alt="golang logo" title="golang logo" /></a></p>
<p><a href="https://gobyexample.com/methods">Struct Method</a> 在 <a href="https://golang.org">Go 語言</a>開發上是一個很重大的功能，而新手在接觸這塊時，通常會搞混為什麼會在 function 內的 struct name 前面多一個 <code>*</code> pointer 符號，而有時候又沒有看到呢？以及如何用 struct method 實現 Chain 的實作，本影片會實際用寄信當作範例講解什麼時候該用 <code>pointer</code> 什麼時候該用用 <code>Value</code>。也可以參考我之前的一篇文章『<a href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a>』</p>
<span id="more-7376"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/36X8uf7AxOg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h2>範例</h2>
<p>要區別 pointer 跟 value 可以透過下面的例子快速了解:</p>
<pre><code class="language-go">package main

import &quot;fmt&quot;

type car struct {
    name  string
    color string
}

func (c *car) SetName01(s string) {
    fmt.Printf(&quot;SetName01: car address: %p\n&quot;, c)
    c.name = s
}

func (c car) SetName02(s string) {
    fmt.Printf(&quot;SetName02: car address: %p\n&quot;, &amp;c)
    c.name = s
}

func main() {
    toyota := &amp;car{
        name:  &quot;toyota&quot;,
        color: &quot;white&quot;,
    }

    fmt.Printf(&quot;car address: %p\n&quot;, toyota)

    fmt.Println(toyota.name)
    toyota.SetName01(&quot;foo&quot;)
    fmt.Println(toyota.name)
    toyota.SetName02(&quot;bar&quot;)
    fmt.Println(toyota.name)
    toyota.SetName02(&quot;test&quot;)
    fmt.Println(toyota.name)
}</code></pre>
<p>上面範例可以看到如果是透過 <code>SetName02</code> 來設定最後是拿不到設定值，這就代表使用 <code>SetName02</code> 時候，是會將整個 struct 複製一份。假設 struct 內有很多成員，這樣付出的代價就相對提高。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6721" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/" class="wp_rp_title">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7330" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/" class="wp_rp_title">用五分鐘了解什麼是 unbuffered vs buffered channel</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="4" data-poid="in-7384" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/" class="wp_rp_title">15 分鐘學習 Go 語言如何處理多個 Channel 通道</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="5" data-poid="in-7346" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/how-to-load-env-file-in-go/" class="wp_rp_title">用 Go 語言讀取專案內 .env 環境變數</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7021" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/" class="wp_rp_title">如何在 Go 專案內寫測試</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-7068" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/08/escape-url-rawquery-on-parse-in-golang/" class="wp_rp_title">在 Go 語言內的 URL RawQuery 的改變</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7397" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/06/how-to-release-the-v2-or-higher-version-in-go-module/" class="wp_rp_title">Go Module 如何發佈 v2 以上版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>