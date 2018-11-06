---
title: "Go 語言 1.11 版本推出 go module"
date: 2018-10-16
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/10/go-1-11-support-go-module/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/40093179410/in/dateposted-public/" title="Go-Logo_Blue"><img src="https://i1.wp.com/farm1.staticflickr.com/908/40093179410_53df4bb9e8_z.jpg?w=840&#038;ssl=1" alt="Go-Logo_Blue" data-recalc-dims="1" /></a>

本篇來聊聊 <a href="https://golang.org">Go 語言</a>在 1.11 版本推出的 <a href="https://github.com/golang/go/wiki/Modules">新功能</a>，相信大家也許還不知道此功能是做什麼用的，我們來回顧看看在初學 Go 語言的時候，最令人困擾的就是 <code>GOPATH</code>，所有的專案都必須要在 GOPATH 底下開發，然而在更久前還沒有 Vendor 時候，兩個專案用不同版本的同一個 Package 就必須要使用多個 GOPATH 來解決，但是隨著 Vendor 在 1.5 版的推出，解決了這問題，所以現在只要把專案放在 GOPATH 底下，剩下的 Package 管理都透過 Vendor 目錄來控管，在很多大型開源專案都可以看到把 Vendor 目錄放入版本控制已經是基本的 Best Practice，而 go module 推出最大功能用來解決 GOPATH 問題，也就是未來開發專案，<strong>隨意讓開發者 clone 專案到任何地方都可以</strong>，另外也統一個 Package 套件管理，不再需要 <code>Vendor</code> 目錄，底下舉個實際例子來說明。

<span id="more-7098"></span>

<h2>影片介紹</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/MXjYRrZnHh0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<hr />

此影片同步在 <a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-TOP">Udemy 課程</a>內，如果有購買課程的朋友們，也可以在 Udemy 上面觀看，如果想學習更多 Go 語言教學，現在可以透過 <strong>$1800</strong> 價格購買。

<h2>傳統 go vendor 管理</h2>

先看個例子:

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;fmt&quot;

    &quot;github.com/appleboy/com/random&quot;
)

func main() {
    fmt.Println(random.String(10))
}
</pre>

將此專案放在 <code>$GOPATH/src/github.com/appleboy/test</code> 這是大家寫專案必定遵守的目錄規則，而 vendor 管理則會從 <a href="https://github.com/golang/go/wiki/PackageManagementTools">PackageManagementTools</a> 選擇一套。底下是用 <a href="https://github.com/kardianos/govendor">govendor</a> 來當作例子

<pre class="brush: plain; title: ; notranslate">
$ govendor init
$ govendor fetch github.com/appleboy/com/random
</pre>

最後用 <code>go build</code> 產生 binary

<pre class="brush: plain; title: ; notranslate">
$ go build -v -o main .
</pre>

如果您不在 GOPATH 裡面工作，就會遇到底下錯誤訊息:

<pre class="brush: plain; title: ; notranslate">
Error: Package &quot;xxxx&quot; not a go package or not in GOPAT
</pre>

如果換到 Go 1.11 版本的 module 功能就能永久解決此問題

<h2>使用 go module</h2>

用 go module 解決兩個問題，第一專案內不必再使用 vendor 管理套件，第二開發者可以任意 clone 專案到任何地方，直接下 go build 就可以拿到執行檔了。底下是使用方式

<pre class="brush: plain; title: ; notranslate">
project
--&gt; main.go
--&gt; main_test.go
</pre>

初始化專案，先啟動 <code>GO111MODULE</code> 變數，在 go 1.11 預設是 <code>auto</code>

<pre class="brush: plain; title: ; notranslate">
$ export GO111MODULE=on
$ go mod init github.com/appleboy/project
</pre>

可以看到專案會多出一個 <code>go.mod</code> 檔案，用來記錄使用到的套件版本，如果本身已經在使用 vendor 管理，那麼 <code>mod init</code> 會自動將 vendor 紀錄的版本寫入到 <code>go.mod</code>。接著執行下載

<pre class="brush: plain; title: ; notranslate">
$ go mod download
</pre>

專案內會多出 <code>go.sum</code> 檔案，其實根本不用執行 <code>go mod download</code>，只要在專案內下任何 <code>go build|test|install</code> 指令，就會自動將 pkg 下載到 <code>GOPATH/pkg/mod</code> 內

<pre class="brush: plain; title: ; notranslate">
$ tree ~/go/pkg/mod/github.com/
/Users/mtk10671/git/go/pkg/mod/github.com/
└── appleboy
    └── com@v0.0.0-20180410030638-c0b5901f9622
        ├── LICENSE
        ├── Makefile
        ├── README.md
        ├── array
        │   ├── array.go
        │   └── array_test.go
        ├── convert
        │   ├── convert.go
        │   └── convert_test.go
        ├── file
        │   ├── file.go
        │   └── file_test.go
        ├── random
        │   ├── random.go
        │   └── random_test.go
        └── vendor
            └── vendor.json
</pre>

目前 go module 還在實驗階段，如果升級套件或下載套件有任何問題，請透過底下指令將 pkg 目錄清空就可以了。

<pre class="brush: plain; title: ; notranslate">
$ go clean -i -x -modcache
</pre>

<h2>心得</h2>

由於 go module 的出現，現在所有的開源專案都相繼支援，但是又要相容於 1.10 版本之前 (含 1.10)，所以變成要維護 <code>go.mod</code> 及 <code>vendor</code> 兩種版本。我個人感覺 go module 解決 GOPATH 問題，不再依賴此環境變數，讓想入門 Go 語言的開發者，可以快速融入開發環境。

<h1><a href="https://github.com/go-training/training/tree/master/example22-go-module-in-go.11">程式碼範例</a></h1>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6342" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/package-management-for-golang-glide/" class="wp_rp_title">Golang 套件管理工具 Glide</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="1" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-6674" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/golang-dependency-management-tool-dep/" class="wp_rp_title">Go 語言官方推出的 dep 使用心得</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="3" data-poid="in-6661" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/" class="wp_rp_title">用 Golang 寫 Command line 工具</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-7068" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/08/escape-url-rawquery-on-parse-in-golang/" class="wp_rp_title">在 Go 語言內的 URL RawQuery 的改變</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7013" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/init-func-in-golang/" class="wp_rp_title">Go 語言的 init 函式</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7087" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/golang-project-quality/" class="wp_rp_title">Go 語言專案程式碼品質</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-7092" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/gofight-support-upload-file-testing/" class="wp_rp_title">gofight 支援多個檔案上傳測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>