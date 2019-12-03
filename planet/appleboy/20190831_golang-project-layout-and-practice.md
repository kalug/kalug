---
title: "Go 語言目錄結構與實踐"
date: 2019-08-31
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/08/golang-project-layout-and-practice/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" title="golang logo"><img src="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" alt="golang logo" title="golang logo" /></a></p>
<p>很高興今年錄取 <a href="https://modernweb.tw/">Modernweb</a> 講師，又有機會去宣傳 <a href="https://golang.org">Go 語言</a>，這次的議程最主要跟大家介紹 Go 專案的目錄該如何設計，一個基本的專案該需要有哪些功能，以及如何實現。大家剛入門 Go 時，肯定會開始找是否有一套 Web Framework 可以參考實踐，可惜的是，在 Go 語言沒有定義任何的目錄結構，所有的結構都可以根據團隊的狀況而有所改變，而這邊我想強調的是如果能讓團隊看到結構後，一目瞭然知道什麼功能該放哪個目錄，或什麼目錄內大概有什麼功能，那其實就夠了。看了許多開源專案，每個設計方式都是不同，但是當你要找什麼功能時，其實從根目錄就可以很清楚的知道要進入哪個地方可以找到您想要的功能及程式碼。這次在 Moderweb 上面的議題，就是分享我在開源專案所使用的目錄結構，以及結構內都放哪些必要的功能。</p>
<span id="more-7452"></span>
<h2>Go 語言基礎實踐</h2>
<p>除了講 Go 的目錄架構外，我還會提到很多小技巧及功能，讓大家可以知道更多相關要入門的 Go 基礎知識，底下是大致上的功能清單:</p>
<ol>
<li>如何使用 Makefile 管理 GO 專案</li>
<li>如何用 <a href="https://docs.docker.com/compose/" title="docker-compose">docker-compose</a> 架設相關服務</li>
<li><a href="https://blog.wu-boy.com/2018/10/go-1-11-support-go-module/">Go module</a> proxy 介紹及部署</li>
<li>專案版本號該如何控制</li>
<li>如何在 Go 語言嵌入靜態檔案</li>
<li>如何實現 <a href="https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status/304" title="304 NOT Modified">304 NOT Modified</a> 功能</li>
<li>簡易的 Healthy check API</li>
<li>Command Line 撰寫</li>
<li>如何實現讀取 <code>.env</code> 及環境變數</li>
<li>整合 <a href="https://prometheus.io/">Prometheus</a> 搭配 Token 驗證</li>
<li>如何測試 <a href="https://www.docker.com/" title="Dokcer">Docker</a> 容器是否正確</li>
<li>實作 custome errors</li>
<li>用 yaml 來產生真實 DB 資料來測試 (支援 SQLite, MySQL 或 Postgres)</li>
<li>透過 <a href="https://golang.org/pkg/testing/#hdr-Main" title="TestMain">TestMain</a> 來實現 setup 或 teardown 功能</li>
<li>用 Go 語言 <a href="https://golang.org/pkg/go/build/" title="Build Tags">Build Tags</a> 支援 SQLite</li>
<li>介紹如何撰寫 <a href="https://golang.org/pkg/testing/" title="Go 語言測試">Go 語言測試</a></li>
</ol>
<p>最後來推廣我的兩門課程，由於 modernweb 不會提供會後錄影，所以我打算把上面的部分在製作影片放到 Udemy 平台給學生學習。</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>投影片</h2>
<iframe src="//www.slideshare.net/slideshow/embed_code/key/dkaLirPqQf6D3V" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/appleboy/golang-project-layout-and-practice-167597350" title="Golang Project Layout and Practice" target="_blank">Golang Project Layout and Practice</a> </strong> from <strong><a href="https://www.slideshare.net/appleboy" target="_blank">Bo-Yi Wu</a></strong> </div>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7405" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/07/speed-up-go-module-download-using-go-proxy-athens/" class="wp_rp_title">架設 Go Proxy 服務加速 go module 下載速度</a><small class="wp_rp_comments_count"> (7)</small><br /></li><li data-position="2" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-6493" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/build-microservices-in-golang/" class="wp_rp_title">2016 COSCUP 用 Golang 寫 Microservices</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6791" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/microservice-in-go/" class="wp_rp_title">用 Go 語言打造微服務架構</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-7549" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/how-to-define-the-golang-folder-layout/" class="wp_rp_title">初探 Go 語言 Project Layout (新人必看)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>