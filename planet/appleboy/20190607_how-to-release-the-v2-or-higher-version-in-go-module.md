---
title: "Go Module 如何發佈 v2 以上版本"
date: 2019-06-07
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/06/how-to-release-the-v2-or-higher-version-in-go-module/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" title="golang logo"><img src="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" alt="golang logo" title="golang logo" /></a></p>
<p><a href="https://github.com/golang/go/wiki/Modules#semantic-import-versioning">Go Module</a> 是 <a href="https://golang.org">Golang</a> 推出的一套件管理系統，在 Go 1.11 推出後，許多 Package 也都陸續支援 Go Module 取代舊有的套件管理系統，像是 govendor 或 dep 等，而再過不久之後，保留 vendor 的方式也會被移除，畢竟現在開發已經不需要在 <code>GOPATH</code> 目錄底下了。對於 Go Module 不熟的話，建議先看官方今年寫的一篇<a href="https://blog.golang.org/using-go-modules">教學部落格</a>，底下是教學會涵蓋的範圍</p>
<ul>
<li>Creating a new module.</li>
<li>Adding a dependency.</li>
<li>Upgrading dependencies.</li>
<li>Adding a dependency on a new major version.</li>
<li>Upgrading a dependency to a new major version.</li>
<li>Removing unused dependencies.</li>
</ul>
<p>而本篇最主要會跟大家探討如何發佈 v2 以上的套件版本。</p>
<span id="more-7397"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/50NJEXIo2Mo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>go.mod 版本管理</h2>
<p>使用 <code>go mod init</code> 之後會在專案目錄產生 go.mod 檔案，裡面可以看到像是底下的訊息</p>
<pre><code class="language-go">module github.com/go-ggz/ggz

go 1.12

require (
    firebase.google.com/go v3.8.0+incompatible
    github.com/appleboy/com v0.0.1
    github.com/appleboy/gofight/v2 v2.0.0
    gopkg.in/nicksrandall/dataloader.v5 v5.0.0
    gopkg.in/testfixtures.v2 v2.5.3
    gopkg.in/urfave/cli.v2 v2.0.0-20180128182452-d3ae77c26ac8
)</code></pre>
<p>Go module 版本發佈請遵守 <a href="https://semver.org/">semver.org</a> 規範，當然不只有 Go 語言，發佈其他語言的套件也請務必遵守。而在 Go module 內有說明『<a href="https://github.com/golang/go/wiki/Modules#semantic-import-versioning">Semantic Import Versioning</a>』裡面大意大致上是說，如果你的套件版本是 v1 以下，像是 <code>v1.2.3</code>，可以直接透過 <code>go get xxxx</code> 方式將套件版本寫入 <code>go.mod</code>，但是看上面的例子，可以發現有些奇怪的字眼，像是 <code>+incompatible</code> 等。如果是看到像底下的套件</p>
<pre><code class="language-go">    firebase.google.com/go v3.8.0+incompatible</code></pre>
<p>表示使用此套件版本大於 <code>v1</code> 這時候是不可以直接下 <code>go get firebase.google.com/go</code>，而要在最後補上 <code>v3</code></p>
<pre><code class="language-go">$ go get firebase.google.com/go/v3</code></pre>
<p>就如同上面的</p>
<pre><code class="language-go">    github.com/appleboy/gofight/v2 v2.0.0
    gopkg.in/nicksrandall/dataloader.v5 v5.0.0
    gopkg.in/testfixtures.v2 v2.5.3</code></pre>
<p>而可以發現 gopkg.in 服務已經符合 semver 的需求在做後面補上了 <code>.v2</code> 或 <code>.v5</code> 所以並不會出現 <code>+incompatible</code> 字眼，另外在看</p>
<pre><code class="language-go">v2.0.0-20180128182452-d3ae77c26ac8</code></pre>
<p>只要後面的格式出現 <code>YYYYmmdd</code> 這種格式表示該套件不支援 Go Module。</p>
<h2>發佈 v2 以上版本方式</h2>
<p>官方提供了兩種做法讓開發者可以發佈 v2 以上版本，一種是透過主 branch，另一種是建立版本目錄，底下來一一說明，第一種是直接在主 branch，像是 <code>master</code> 內的 <code>go.mod</code> 內補上版本，底下是範例:</p>
<pre><code class="language-go">module github.com/appleboy/gofight/v2</code></pre>
<p>這時候你就可以陸續發佈 v2 版本的 Tag。大家可以發現這個方式，是不需要建立任何 sub folder，而另外一種方式是不需要改動 <code>go.mod</code>，直接在專案目錄內放置 <code>v2</code> 目錄，然後把所有程式碼複製一份到該目錄底下，接著繼續開發，這方式我個人不太建議，原因檔案容量會增加很快，也不好維護。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="1" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7405" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/07/speed-up-go-module-download-using-go-proxy-athens/" class="wp_rp_title">架設 Go Proxy 服務加速 go module 下載速度</a><small class="wp_rp_comments_count"> (7)</small><br /></li><li data-position="3" data-poid="in-7098" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/go-1-11-support-go-module/" class="wp_rp_title">Go 語言 1.11 版本推出 go module</a><small class="wp_rp_comments_count"> (9)</small><br /></li><li data-position="4" data-poid="in-6342" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/package-management-for-golang-glide/" class="wp_rp_title">Golang 套件管理工具 Glide</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="5" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="6" data-poid="in-7013" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/init-func-in-golang/" class="wp_rp_title">Go 語言的 init 函式</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6674" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/golang-dependency-management-tool-dep/" class="wp_rp_title">Go 語言官方推出的 dep 使用心得</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="8" data-poid="in-7087" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/golang-project-quality/" class="wp_rp_title">Go 語言專案程式碼品質</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="9" data-poid="in-7092" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/gofight-support-upload-file-testing/" class="wp_rp_title">gofight 支援多個檔案上傳測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>