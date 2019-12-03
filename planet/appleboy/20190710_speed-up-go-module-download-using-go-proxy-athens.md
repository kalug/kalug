---
title: "架設 Go Proxy 服務加速 go module 下載速度"
date: 2019-07-10
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/07/speed-up-go-module-download-using-go-proxy-athens/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" title="golang logo"><img src="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" alt="golang logo" title="golang logo" /></a></p>
<p><a href="https://golang.org">Go 語言</a>在 1.11 推出 go module 來統一市面上不同管理 Go 套件的工具，像是 <a href="https://github.com/golang/dep">dep</a> 或 govendor 等，還不知道如何使用 go module，可以參考之前寫的一篇文章『<a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a>』，在團隊內如果每個人在開發專案時，都透過網路去下載專案使用到的套件，這樣 10 個人就會浪費 10 個人的下載時間，並且佔用公司網路頻寬，所以我建議在公司內部架設一台 Go Proxy 服務，減少團隊在初始化專案所需要的時間，也可以減少在跑 CI/CD 流程時，所需要花費的時間，測試過公司 CI/CD 流程，有架設 Go Proxy，一般來說可以省下 1 ~ 2 分鐘時間，根據專案使用到的相依性套件用量來決定花費時間。本篇來介紹如何架設 <a href="https://github.com/gomods/athens">ATHENS</a> 這套開源 Go Proxy 專案。</p>
<span id="more-7405"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/964fZJPVHDI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>架設 ATHENS 服務</h2>
<p>你也可以使用外面公開的 GO Proxy 服務，非 China 地區請使用 <a href="https://goproxy.io/">goproxy.io</a>，如果在中國內地，請使用 <a href="https://github.com/goproxy/goproxy.cn">gorpoxy.cn</a>，會降低不少 CI/CD 時間。架設 ATHENS 並不難，只需要透過 <a href="https://www.docker.com/">Docker</a> 一個指令就可以完成，更詳細的步驟可以參考<a href="https://docs.gomods.io/install/">官方文件</a></p>
<pre><code class="language-bash">export ATHENS_STORAGE=~/athens-storage
mkdir -p $ATHENS_STORAGE
docker run -d -v $ATHENS_STORAGE:/var/lib/athens \
   -e ATHENS_DISK_STORAGE_ROOT=/var/lib/athens \
   -e ATHENS_STORAGE_TYPE=disk \
   --name athens-proxy \
   --restart always \
   -p 3000:3000 \
   gomods/athens:latest</code></pre>
<p>其中 <code>ATHENS_STORAGE</code> 請定義一個實體空間路徑，存放從網路抓下來的第三方套件，當然 ATHENS 還有支援不同的 storage type，像是 Memory, AWS S3 或公司內部有架設 <a href="https://min.io/">Minio</a>，都是可以設定的。</p>
<h2>如何使用 Go Proxy</h2>
<p>使用方式非常簡單，只要在您的開發環境加上一些環境變數</p>
<pre><code class="language-bash">$ export GO111MODULE=on
$ export GOPROXY=http://127.0.0.1:3000</code></pre>
<p>接著專案使用的任何 Go 指令，只要需要 Donwload 第三方套件，都會先詢問公司內部的 Proxy 服務，如果沒有就會透過 Proxy 抓一份下來 Cache，下次有團隊同仁需要用到，就不需要上 Internet 抓取了。</p>
<p>至於 CI/CD 流程該如何設定呢？非常簡單，底下是 <a href="https://github.com/drone/drone">drone</a> 的設定方式:</p>
<pre><code class="language-yml">- name: embedmd
  pull: always
  image: golang:1.12
  commands:
  - make embedmd
  environment:
    GO111MODULE: on
    GOPROXY: http://127.0.0.1:3000
  volumes:
  - name: gopath
    path: /go</code></pre>
<h2>心得</h2>
<p>團隊如果尚未導入 GO Proxy 的朋友們，請務必導入，不然就要自己 cache mod 目錄，但是我覺得不是很方便就是了，架設一台 Proxy，不用一分鐘，但是可以省下團隊開發及部署很多時間，這項投資很值得的。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="1" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7397" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/06/how-to-release-the-v2-or-higher-version-in-go-module/" class="wp_rp_title">Go Module 如何發佈 v2 以上版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-7452" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/golang-project-layout-and-practice/" class="wp_rp_title">Go 語言目錄結構與實踐</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-7108" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/deploy-app-to-aws-lambda-using-up-tool-in-ten-minutes/" class="wp_rp_title">用 10 分鐘部署專案到 AWS Lambda</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>