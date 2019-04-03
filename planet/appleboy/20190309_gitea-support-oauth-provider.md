---
title: "開源專案 Gitea 支援 OAuth Provider"
date: 2019-03-09
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/SrQvhDJm5NMkrxrut0lACspnz6iQSFCX3vlbtGCuAcwO-i_4iJCJ6trK3V2F6Q6s6fQ_EcSglwAL0qO0aLaTRtk4Ca32EI7Ks1H7u_nI9jC6xn3PF9hhgccjkbN3irX5pGi9kV-vIxk=w1920-h1080" title="Gitea"><img src="https://lh3.googleusercontent.com/SrQvhDJm5NMkrxrut0lACspnz6iQSFCX3vlbtGCuAcwO-i_4iJCJ6trK3V2F6Q6s6fQ_EcSglwAL0qO0aLaTRtk4Ca32EI7Ks1H7u_nI9jC6xn3PF9hhgccjkbN3irX5pGi9kV-vIxk=w1920-h1080" alt="Gitea" title="Gitea" /></a></p>
<p>很高興看到 <a href="https://gitea.io" title="Gitea">Gitea</a> 正式支援 <a href="https://github.com/go-gitea/gitea/pull/5378" title="OAuth Provider ">OAuth Provider</a> 了，此功能經歷了四個月終於正式合併進 master 分支，預計會在 <a href="https://github.com/go-gitea/gitea/milestone/32" title="1.18 版本">1.8 版本</a>釋出，由於此功能已經進 master，這樣我們就可以把原本 Drone 透過帳號密碼登入，改成使用 OAtuh 方式了，增加安全性。但是在使用之前，Drone 需要合併 <a href="https://github.com/drone/go-login/pull/3" title="drone/go-login">drone/go-login@3</a> 及 <a href="https://github.com/drone/drone/pull/2622" title="drone/drone@2622">drone/drone@2622</a>。如果您會使用 Go 語言，不妨現在就可以來試試看了，透過 go build 來編譯原始碼。</p>
<span id="more-7280"></span>
<h2>影片教學</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/OX7WpJ5X19g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>有興趣可以參考線上教學</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>安裝 Gitea</h2>
<p>由於 Gitea 還沒轉到 <a href="https://blog.wu-boy.com/2018/10/go-1-11-support-go-module/" title="Go module">Go module</a> (已經有另外一個 PR 再處理 Vendor)，所以請 clone 專案原始碼到 <code>GOPATH</code> 底下</p>
<pre><code class="language-bash">$ git clone https://github.com/go-gitea/gitea.git \
  /go/src/code.gitea.io/gitea</code></pre>
<p>接著切換到專案目錄，編譯出 SQLite 的 Binary</p>
<pre><code class="language-bash">$ TAGS="sqlite sqlite_unlock_notify" make</code></pre>
<p>編譯完成後，直接執行</p>
<pre><code class="language-bash">$ ./gitea web
2019/03/09 12:26:03 [T] AppPath: /Users/appleboy/git/go/src/code.gitea.io/gitea/gitea
2019/03/09 12:26:03 [T] AppWorkPath: /Users/appleboy/git/go/src/code.gitea.io/gitea
2019/03/09 12:26:03 [T] Custom path: /Users/appleboy/git/go/src/code.gitea.io/gitea/custom
2019/03/09 12:26:03 [T] Log path: /Users/appleboy/git/go/src/code.gitea.io/gitea/log
2019/03/09 12:26:03 Serving [::]:3000 with pid 18284</code></pre>
<p>打開瀏覽器登入後，進入右上角使用者設定，就可以建立新的 Application。</p>
<p><a href="https://lh3.googleusercontent.com/PPql-MM_46UuURU-Y-w6iI7E673mEvMT49BmDd5joskzDx7mzCuTdMLThZSI6getcl_-lSfyJr0d5YOsFN4j57qUEVto-SKFGzFxLdevK3saSqVeLEnPd2BtIxLrbXOxSvJPlqZQwXs=w1920-h1080"><img src="https://lh3.googleusercontent.com/PPql-MM_46UuURU-Y-w6iI7E673mEvMT49BmDd5joskzDx7mzCuTdMLThZSI6getcl_-lSfyJr0d5YOsFN4j57qUEVto-SKFGzFxLdevK3saSqVeLEnPd2BtIxLrbXOxSvJPlqZQwXs=w1920-h1080" alt="" /></a></p>
<p>其中 <code>Redirect URL</code> 請填上 drone 的 URL <code>http://localhost:8080/login</code></p>
<h2>安裝 <a href="https://drone.io/">Drone</a></h2>
<p>在上面有提到需要合併兩個 PR (<a href="https://github.com/drone/go-login/pull/3" title="drone@go-login#3">drone@go-login#3</a> 及 <a href="https://github.com/drone/drone/pull/2622" title="drone@drone#2622">drone@drone#2622</a>) 才能使用此功能，等不及的朋友們就自己先 Fork 來使用吧。先假設已經合併完成。</p>
<pre><code class="language-bash">$ cd $GOPAHT/drone
$ go build ./cmd/drone-server</code></pre>
<p>然後建立 <code>server.sh</code> 將環境變數寫入</p>
<pre><code class="language-bash">#!/bin/sh
export DRONE_GITEA_SERVER=http://localhost:3000
export DRONE_GITEA_CLIENT_ID=49de7c23-3bed-45a1-a78e-89c8ba4db07b
export DRONE_GITEA_CLIENT_SECRET=8GhG9XvPJEpaOroVocmJPAQArO5Zz7KMLQ5df0eG91c=
./drone-server</code></pre>
<p>啟動 drone 服務，會看到一些 Info 訊息:</p>
<pre><code class="language-bash">$ ./server.sh 
{"level":"info","msg":"main: internal scheduler enabled","time":"2019-03-09T12:39:21+08:00"}
{"level":"info","msg":"main: starting the local build runner","threads":2,"time":"2019-03-09T12:39:21+08:00"}
{"acme":false,"host":"localhost:8080","level":"info","msg":"starting the http server","port":":8080","proto":"http","time":"2019-03-09T12:39:21+08:00","url":"http://localhost:8080"}
{"interval":"30m0s","level":"info","msg":"starting the cron scheduler","time":"2019-03-09T12:39:21+08:00"}</code></pre>
<p>打開瀏覽器輸入 <code>http://localhost:8080</code> 就可以看到跳轉到 OAuth 頁面</p>
<p><a href="http://https://lh3.googleusercontent.com/hmLWyzXVezGiaOQlsv3hN_l_wymxU3nrpjgGomhkbx5_I7K8-phnkKtXpZRyWZwuDiifhKIU7LCsKnY6Gjl84kGCFdv3UoMF0y192ZkxdIZeYFAwS8y75zzA0RWpEBW8iO9GYlEWKwk=w1920-h1080"><img src="https://lh3.googleusercontent.com/hmLWyzXVezGiaOQlsv3hN_l_wymxU3nrpjgGomhkbx5_I7K8-phnkKtXpZRyWZwuDiifhKIU7LCsKnY6Gjl84kGCFdv3UoMF0y192ZkxdIZeYFAwS8y75zzA0RWpEBW8iO9GYlEWKwk=w1920-h1080" alt="" /></a></p>
<h2>心得</h2>
<p>現在 Gitea 已經支援 OAuth Provider，未來可以再接更多第三方服務，這樣就可以不用透過帳號密碼登入，避免讓第三方服務存下您的密碼。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7132" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/drone-cloud-service/" class="wp_rp_title">Drone CI/CD 推出 Cloud 服務支援開源專案</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="1" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-6786" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/2017-coscup-introduction-to-gitea-drone/" class="wp_rp_title">2017 COSCUP 研討會: Gitea + Drone 介紹</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="3" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6634" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/01/new-git-code-hosting-option-gitea/" class="wp_rp_title">開發者另類的自架 Git 服務選擇: Gitea</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="6" data-poid="in-7226" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/converts-a-jsonnet-configuration-file-to-a-yaml-in-drone/" class="wp_rp_title">有效率的用 jsonnet 撰寫  Drone CI/CD 設定檔</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="7" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-6904" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/drone-secret-security/" class="wp_rp_title">Drone Secret 安全性管理</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>