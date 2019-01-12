---
title: "Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具"
date: 2018-12-30
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/
layout: post
comments: true
---

<p><a href='https://photos.google.com/share/AF1QipPZ8MkcLAazbfRWwBrT1CQpipCL8N_1uAcYosJmJ-o6du2XRRHNEokVarxey5Bp8w?key=clctLU9JYVMzcEdHYWR2dUlVTVZ6YnZUUjlYRG9B&#038;source=ctrlq.org'><img src='https://lh3.googleusercontent.com/Q5CP9S-xtRHxnDRvxDpWWkvBsEVw5C5uRyb5EiBh-UpYkrp_dkZp_oN8yi1WtqwruhSgnwNMB5QjJPxO94ABjG9oLBqmcRjlouNTNmrChIWbQcsAAbuV9eWB1wbsK-x-OY6iolb5ahc=w2400' /></a></p>
<p>相信各位 <a href="http://golang.org">Go 語言</a>開發者陸陸續續都將專案從各種 <a href="https://github.com/golang/go/wiki/PackageManagementTools">Vendor 工具</a>轉換到 <a href="https://github.com/golang/go/wiki/Modules">Go Module</a>，本篇會帶大家一步一步從舊專案轉換到 Go Module，或是該如何導入新專案，最後會結合 CI/CD 著名的兩套工具 <a href="https://travis-ci.org/">Travis</a> 或 <a href="https://drone.io/">Drone</a> 搭配 Go Module 測試。</p>
<span id="more-7170"></span>
<h2>影片介紹</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/n1CvIb2-D8s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ol>
<li>舊專案內 vendor 轉換成 go module 設定 (1:15)</li>
<li>新專案如何啟用  go module (6:20)</li>
<li>在 Travis CI 或 Drone 如何使用 go module (8:31)</li>
<li>在開源專案內並存 vendor 及 go module (介紹 Gin 如何使用 vendor 及 go module) (15:00)</li>
</ol>
<p>更多實戰影片可以參考我的 <a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-TOP" title="Udemy 教學系列">Udemy 教學系列</a></p>
<h2>舊專案</h2>
<p>假設原本的專案有導入 vendor 工具類似 <a href="https://github.com/kardianos/govendor" title="govendor">govendor</a> 或 <a href="https://github.com/golang/dep" title="dep">dep</a>，可以在目錄底下找到 <code>vendor/vendor.json</code> 或 <code>Gopkg.toml</code>，這時候請在專案目錄底下執行</p>
<pre><code class="language-bash">$ go mod init github.com/appleboy/drone-line
$ go mod download</code></pre>
<p>您會發現 go module 會從 <code>vendor/vendor.json</code> 或 <code>Gopkg.toml</code> 讀取相關套件資訊，接著寫進去 <code>go.mod</code> 檔案，完成後可以下 <code>go mod dowload</code> 下載所有套件到 <code>$HOME/go/pkg/mod</code></p>
<h2>新專案</h2>
<p>新專案只需要兩個步驟就可以把相關套件設定好</p>
<pre><code class="language-bash">$ go mod init github.com/appleboy/drone-line
$ go mod tidy</code></pre>
<p>其中 tidy 可以確保 <code>go.mod</code> 或 <code>go.sum</code> 裡面的內容都跟專案內所以資料同步，假設在程式碼內移除了 package，這樣 tidy 會確保同步性移除相關 package。</p>
<h2>整合 Travis 或 Drone</h2>
<p>go module 在 1.11 版本預設是不啟動的，那在 Travis 要把 <code>GO111MODULE</code> 環境變數打開</p>
<pre><code class="language-yaml">matrix:
  fast_finish: true
  include:
  - go: 1.11.x
    env: GO111MODULE=on</code></pre>
<p>完成後可以到 <a href="https://travis-ci.org/gin-contrib/expvar/jobs/473545874http://" title="Travis 的環境">Travis 的環境</a>看到底下 <code>go get</code> 紀錄</p>
<p><a href='https://photos.google.com/share/AF1QipOdciWDnbJ3B9GsdYMXJqZbjtNE6rVMSvPSSFavowykZXxvZsATX_aA_Tib3q88aw?key=eWFTcDNIeGhjWlRJSzFaVjhKRFZ3a0YyMXlqcm5B&#038;source=ctrlq.org'><img src='https://lh3.googleusercontent.com/GRLzV6tA4qUB7kBMqf4jJ341-cRfgzVz-0PhhrtO-shEP2S7fijs3gTzdlWHkX8wLUOtYaguHbIUWjYihnXg8G2-w6LJG9V92g1pZlmatre1ZyY6uh5ChPU-CszxUWm1uDxo-Lc6oMI=w2400' /></a></p>
<p>而在 <a href="https://github.com/appleboy/drone-facebook/blob/082f8901c8d56cf485ef7709466de56468f0b5cf/.drone.yml#L11-L21" title="Drone 的設定">Drone 的設定</a>如下:</p>
<pre><code class="language-yaml">steps:
  - name: testing
    image: golang:1.11
    pull: true
    environment:
      GO111MODULE: on
    commands:
      - make vet
      - make lint
      - make misspell-check
      - make fmt-check
      - make build_linux_amd64
      - make test</code></pre>
<p><a href='https://photos.google.com/share/AF1QipOqJHtB3zHBNRz5ulb7yqtzeh7QVA0EZjlzGrzEN1CVbMntlM-bPaPl3TZCUpquAg?key=QW9WTF9xYzFlcmN0WE9ab0FqZXUtNHJrd2FjaHpB&#038;source=ctrlq.org'><img src='https://lh3.googleusercontent.com/90qm06Jcs6b8C1eJFlky1gWk_jXuPZpnYhElFTZMlmyP37olX0lOet0w4XCrgRVZyr8Cftb0nKqmBNYIkYNlGy1TK26-8OYQJXPbVJObY4RdGfmrsEXq3lHOZVfXp-puQGHTbwWSsYM=w2400' /></a></p>
<h2>結論</h2>
<p>在開源專案內為了相容 Go 舊版本，所以 <a href="https://github.com/gin-gonic/gin" title="Gin">Gin</a> 同時支援了 govendor 及 go module，其實還蠻難維護的，但是可以透過 travis 環境變數的判斷來達成目的:</p>
<pre><code class="language-yaml">language: go
sudo: false
go:
  - 1.6.x
  - 1.7.x
  - 1.8.x
  - 1.9.x
  - 1.10.x
  - 1.11.x
  - master

matrix:
  fast_finish: true
  include:
  - go: 1.11.x
    env: GO111MODULE=on

git:
  depth: 10

before_install:
  - if [[ "${GO111MODULE}" = "on" ]]; then mkdir "${HOME}/go"; export GOPATH="${HOME}/go"; fi

install:
  - if [[ "${GO111MODULE}" = "on" ]]; then go mod download; else make install; fi
  - if [[ "${GO111MODULE}" = "on" ]]; then export PATH="${GOPATH}/bin:${GOROOT}/bin:${PATH}"; fi
  - if [[ "${GO111MODULE}" = "on" ]]; then make tools; fi</code></pre>
<p>詳細設定請<a href="https://github.com/gin-gonic/gin/blob/master/.travis.yml">參考 .travis 設定</a></p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-7115" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/drone-release-1-0-0-rc1/" class="wp_rp_title">開源專案 Drone 推出 1.0.0 RC1 版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-7108" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/deploy-app-to-aws-lambda-using-up-tool-in-ten-minutes/" class="wp_rp_title">用 10 分鐘部署專案到 AWS Lambda</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6517" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/09/upload-docker-image-to-registry-using-travis/" class="wp_rp_title">用 Travis 自動上傳 Docker Image 到 Docker Registry</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6526" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/09/docker-cache-on-travis/" class="wp_rp_title">在 Travis 實現 Docker Cache</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>