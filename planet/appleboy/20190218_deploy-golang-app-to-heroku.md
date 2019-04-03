---
title: "快速部署網站到 Heroku 雲平台"
date: 2019-02-18
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jx4kYMmehnuyhVbEhvZKNEQwjCAgcTg2JIQamusY9-SuIbEEvJl2zXLJidfq-m9Oy1PQrROA9GQxdjjSiRVsvAGIj3tikwT0ZNB9XhciyCwjE60XE_jDJIqqEMmaKqwDzCMirK0u7Hw=w1920-h1080" title="部署網站到 Heroku 平台"><img src="https://lh3.googleusercontent.com/jx4kYMmehnuyhVbEhvZKNEQwjCAgcTg2JIQamusY9-SuIbEEvJl2zXLJidfq-m9Oy1PQrROA9GQxdjjSiRVsvAGIj3tikwT0ZNB9XhciyCwjE60XE_jDJIqqEMmaKqwDzCMirK0u7Hw=w1920-h1080" alt="部署網站到 Heroku 平台" title="部署網站到 Heroku 平台" /></a></p>
<p>大家在寫開源專案時，一定需要一個免費的雲空間來放置網站，方便其他開發者在 <a href="https://github.com" title="GitHub">GitHub</a> 看到時，可以先點選 Demo 網站來試用，也許開發者可以使用 GitHub 提供的免<a href="https://pages.github.com/" title="費靜態網站">費靜態網站</a>，但是如果是跑 <a href="https://golang.org" title="Golang">Golang</a> 或是其他語言 <a href="https://nodejs.org/" title="Node.js">Node.js</a> 就不支援了，本篇來介紹 <a href="https://www.heroku.com/" title="Ｈeroku 雲平台">Heroku 雲平台</a>，它提供了開發者免費的方案，您可以將 GitHub 儲存庫跟 Heroku 結合，快速的將程式碼部署上去，Heroku 會給開發者一個固定的 URL (含有 HTTPS 憑證)，也可以動態的用自己買的網域。最重要的是 Heroku 提供了兩種更新方式，第一為 Git，只要開發者將程式碼 Push 到 Heroku 儲存庫，Heroku 就可以自動判斷開發者上傳的語言，並進行相對應的部署，另一種方式為 <a href="https://www.docker.com/" title="Docker">Docker</a> 部署，只要在儲存庫內放上 Dockerfile，透過 <a href="https://devcenter.heroku.com/articles/heroku-cli" title="Heroku CLI">Heroku CLI</a> 指令就可以將 Docker 容器上傳到 <a href="https://devcenter.heroku.com/articles/container-registry-and-runtime" title="Heroku Docker Registry">Heroku Docker Registry</a>，並且自動部署網站。底下我們來透過簡單的 Go 語言專案: <a href="https://github.com/go-training/facebook-account-kit" title="Facebook Account Kit">Facebook Account Kit</a> 來說明如何快速部署到 Heroku。</p>
<span id="more-7250"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/PszIIP4gyRs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>歡迎訂閱<a href="http://bit.ly/youtube-boy" title="我的 Youtube 頻道">我的 Youtube 頻道</a></p>
<h2>使用 Git 部署</h2>
<p>註冊網站後，可以直接在後台建立 App，此 App 名稱就是未來的網站 URL 前置名稱。進入 App 的後台，切換到 Deploy 的 Tab 可以看到 Heroku 提供了三種方式，本文只會講其中兩種，在開始之前請先安裝好 <a href="https://devcenter.heroku.com/articles/heroku-command-line" title="Heroku CLI">Heroku CLI</a> 工具，底下所有操作都會以 CLI 介面為主。用 Git 來部署是最簡單的，開發者可以不用考慮任何情形，只要將程式碼部署到 Heroku 上面即可。在 Go 語言只要觸發 Push Event 系統會預設使用 go1.11.4 來編譯環境，產生的 Log 如下:</p>
<pre><code class="language-go">-----&gt; Go app detected
-----&gt; Fetching jq... done
 !!    
 !!    Go modules are an experimental feature of go1.11
 !!    Any issues building code that uses Go modules should be
 !!    reported via: https://github.com/heroku/heroku-buildpack-go/issues
 !!    
 !!    Additional documentation for using Go modules with this buildpack
 !!    can be found here: https://github.com/heroku/heroku-buildpack-go#go-module-specifics
 !!    
 !!    The go.mod file for this project does not specify a Go version
 !!    
 !!    Defaulting to go1.11.4
 !!    
 !!    For more details see: https://devcenter.heroku.com/articles/go-apps-with-modules#build-configuration
 !!    
-----&gt; Installing go1.11.4
-----&gt; Fetching go1.11.4.linux-amd64.tar.gz... done
 !!    Installing package '.' (default)
 !!    
 !!    To install a different package spec add a comment in the following form to your `go.mod` file:
 !!    // +heroku install ./cmd/...
 !!    
 !!    For more details see: https://devcenter.heroku.com/articles/go-apps-with-modules#build-configuration
 !!    
-----&gt; Running: go install -v -tags heroku . </code></pre>
<p>系統第一步會偵測該專案使用什麼語言，就會產生相對應得環境，所以用 Git 方式非常簡單，開發者不需要額外設定就可以看到網站已經部署完畢，底下是 Git 基本操作，首先是登入 Heroku 平台。這邊會打開瀏覽器登入視窗。</p>
<pre><code class="language-sh">$ heroku login</code></pre>
<p>新增 Heroku 為另一個 Remote 節點</p>
<pre><code class="language-sh">$ heroku git:clone -a heroku-demo-tw
$ cd heroku-demo-tw</code></pre>
<p>簡單編輯程式碼，並且推到 Heroku Git 服務</p>
<pre><code class="language-sh">$ git add .
$ git commit -am "make it better"
$ git push heroku master</code></pre>
<h2>使用 Docker 部署</h2>
<p>Heroku 也提供免費的 Docker Registry 讓開發者可以寫 <a href="https://github.com/go-training/facebook-account-kit/blob/1faa35cf83e3e00c8b48e3047d676c379a1aef44/Dockerfile#L1" title="Dockerfile">Dockerfile</a> 來部署，底下是透過 <a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" title="Docker multiple stage">Docker multiple stage</a> 來編譯 Go 語言 App</p>
<pre><code class="language-docker">FROM golang:1.11-alpine as build_base
RUN apk add bash ca-certificates git gcc g++ libc-dev
WORKDIR /app
# Force the go compiler to use modules
ENV GO111MODULE=on
# We want to populate the module cache based on the go.{mod,sum} files.
COPY go.mod .
COPY go.sum .
RUN go mod download

# This image builds the weavaite server
FROM build_base AS server_builder
# Here we copy the rest of the source code
COPY . .
ENV GOOS=linux
ENV GOARCH=amd64
RUN go build -o /facebook-account-kit -tags netgo -ldflags '-w -extldflags "-static"' .

### Put the binary onto base image
FROM plugins/base:linux-amd64
LABEL maintainer="Bo-Yi Wu &lt;appleboy.tw@gmail.com&gt;"
EXPOSE 8080
COPY --from=server_builder /app/templates /templates
COPY --from=server_builder /app/images /images
COPY --from=server_builder /facebook-account-kit /facebook-account-kit
CMD ["/facebook-account-kit"]</code></pre>
<p>這裡面有一個小技巧，讓每次 Docker 編譯時可以 cache 住 golang 的 vendor，就是底下這兩行啦</p>
<pre><code class="language-dockerfile"># We want to populate the module cache based on the go.{mod,sum} files.
COPY go.mod .
COPY go.sum .
RUN go mod download</code></pre>
<p>這時候只要我們沒有動過 <code>go.*</code> 相關檔案，每次編譯時系統就會自動幫忙 cache 相關 vendor 套件，加速網站部署，完成上述設定後，接著用 Heroku CLI 來完成最後步驟。首先在開發電腦上面必須安裝好 Docker 環境，可以透過底下指令來確認電腦是否有安裝好 Docker</p>
<pre><code class="language-sh">$ docker ps</code></pre>
<p>現在可以登入 Container Registry
Now you can sign into Container Registry.</p>
<pre><code class="language-sh">$ heroku container:login</code></pre>
<p>上傳 Docker 映像檔到 Heroku，這邊會在 Local 直接編譯產生 Image</p>
<pre><code class="language-sh">$ heroku container:push web</code></pre>
<p>上面步驟只是上傳而已，並非部署上線，透過底下指令才能正確看到網站更新。</p>
<pre><code class="language-sh">$ heroku container:release web</code></pre>
<h2>心得</h2>
<p>上面所有的程式碼都可以在<a href="https://github.com/go-training/facebook-account-kit" title="這邊找到">這邊找到</a>，這邊我個人推薦使用 Docker 方式部署，原因很簡單，如果使用 Docker 部署，未來您不想使用 Heroku，就可以很輕易地轉換到 <a href="https://aws.amazon.com/" title="AWS">AWS</a> 或 <a href="https://cloud.google.com/gcp" title="GCP">GCP</a> 等平台，畢竟外面的雲平台不可以提供 Git 服務並且自動部署。使用 Docker 形式也可以減少很多部署的工作，對於未來轉換平台來說是非常方便的。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="1" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="3" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6493" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/build-microservices-in-golang/" class="wp_rp_title">2016 COSCUP 用 Golang 寫 Microservices</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7217" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/" class="wp_rp_title">Traefik 搭配 Docker 自動更新 Let&#8217;s Encrypt 憑證</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="6" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6661" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/" class="wp_rp_title">用 Golang 寫 Command line 工具</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6634" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/01/new-git-code-hosting-option-gitea/" class="wp_rp_title">開發者另類的自架 Git 服務選擇: Gitea</a><small class="wp_rp_comments_count"> (4)</small><br /></li></ul></div></div>