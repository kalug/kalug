---
title: "Traefik 搭配 Docker 自動更新 Let’s Encrypt 憑證"
date: 2019-01-20
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/sggr23jjw2BJb3HMIpM9RtSTetm8TeEuk1CCbV6658ZZO5CCwEPK2YdGpOYPFrw4fansfS-aMNE5h-uv-8s7quNiuj4EU-UF0DBaNbKZt3YyNruAICq6JxUss9S5IPAC7TQfQlHbL2M=w1920-h1080"><img src="https://lh3.googleusercontent.com/sggr23jjw2BJb3HMIpM9RtSTetm8TeEuk1CCbV6658ZZO5CCwEPK2YdGpOYPFrw4fansfS-aMNE5h-uv-8s7quNiuj4EU-UF0DBaNbKZt3YyNruAICq6JxUss9S5IPAC7TQfQlHbL2M=w1920-h1080" alt="" /></a></p>
<p>之前寫過蠻多篇 <a href="https://blog.wu-boy.com/?s=+Let%27s+Encrypt" title="Let&#039;s Encrypt 的使用教學">Let&#8217;s Encrypt 的使用教學</a>，但是這次要跟大家介紹一套非常好用的工具 <a href="https://traefik.io/" title="Traefik">Traefik</a> 搭配自動化更新 Let&#8217;s Encrypt 憑證，為什麼會推薦 Traefik 呢，原因在於 Traefik 可以自動偵測 Docker 容器內的 Label 設定，並且套用設定在 Traefik 服務內，也就是只要修改服務的 docker-compose 內容，重新啟動，Traefik 就可以抓到新的設定。這點在其它工具像是 <a href="https://www.nginx.com/" title="Nginx">Nginx</a> 或 <a href="https://caddyserver.com" title="Caddy">Caddy</a> 是無法做到的。底下我們來一步一步教大家如何設定啟用前後端服務。全部程式碼都放在 <a href="https://github.com/go-training/training/tree/master/example25-traefik-golang-app-lets-encrypt" title="GitHub 上面">GitHub 上面</a>了。</p>
<span id="more-7217"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/ddJxBXShkZg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h2>啟動 Traefik 服務</h2>
<p>在啟動 Traefik 服務前，需要建立一個獨立的 Docker 網路，請在 Host 內下</p>
<pre><code class="language-bash">$ docker network create web</code></pre>
<p>接著建立 Traefik 設定檔存放目錄 <code>/opt/traefik</code> 此目錄自由命名。</p>
<pre><code class="language-bash">$ mkdir -p /opt/traefik</code></pre>
<p>接著在此目錄底下建立三個檔案</p>
<pre><code class="language-bash">$ touch /opt/traefik/docker-compose.yml
$ touch /opt/traefik/acme.json &amp;&amp; chmod 600 /opt/traefik/acme.json
$ touch /opt/traefik/traefik.toml</code></pre>
<p>其中 <code>docker-compose.yml</code> 用來啟動 Traefik 服務，<code>acme.json</code> 則是存放 Let&#8217;s Encrypt 的憑證，此檔案權限必須為 <code>600</code>，最後則是 traefik 設定檔 <code>traefik.toml</code>。一一介紹這些檔案的內容，底下是 <code>docker-compose.yml</code></p>
<pre><code class="language-yaml">version: '2'

services:
  traefik:
    image: traefik
    restart: always
    ports:
      - 80:80
      - 443:443
    networks:
      - web
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /opt/traefik/traefik.toml:/traefik.toml
      - /opt/traefik/acme.json:/acme.json
    container_name: traefik

networks:
  web:
    external: true</code></pre>
<p>此檔案必須要由 <code>root</code> 使用者來執行，原因是要 Listen 80 及 443 連接埠，其中 acme.json 及 traefik.toml 則由 host 檔案直接掛載進容器內。接著看 <code>traefik.toml</code></p>
<pre><code class="language-toml">debug = false

logLevel = "INFO"
defaultEntryPoints = ["https","http"]

[entryPoints]
  [entryPoints.http]
  address = ":80"
    [entryPoints.http.redirect]
    entryPoint = "https"
  [entryPoints.https]
  address = ":443"
  [entryPoints.https.tls]

[acme]
email = "xxxxx@gmail.com"
storage = "acme.json"
entryPoint = "https"
onHostRule = true

[acme.httpChallenge]
entryPoint = "http"

[docker]
endpoint = "unix:///var/run/docker.sock"
watch = true</code></pre>
<p>其中 <code>onHostRule</code> 用於讀取 docker container 內的 <code>frontend.rule</code> 的 <code>Host</code> 設定，這樣才可以跟 Let&#8217;s Encrypt 申請到憑證。最後啟動步驟</p>
<pre><code class="language-bash">$ cd /opt/traefik
$ docker-compose up -d</code></pre>
<h2>啟動 App 服務</h2>
<p>請打開 docker-compose.yml 檔案</p>
<pre><code class="language-yaml">version: '3'

services:
  app_1:
    image: appleboy/test:alpine
    restart: always
    networks:
      - web
    logging:
      options:
        max-size: "100k"
        max-file: "3"
    labels:
      - "traefik.docker.network=web"
      - "traefik.enable=true"
      - "traefik.basic.frontend.rule=Host:demo1.ggz.tw"
      - "traefik.basic.port=8080"
      - "traefik.basic.protocol=http"

  app_2:
    image: appleboy/test:alpine
    restart: always
    networks:
      - web
    logging:
      options:
        max-size: "100k"
        max-file: "3"
    labels:
      - "traefik.docker.network=web"
      - "traefik.enable=true"
      - "traefik.basic.frontend.rule=Host:demo2.ggz.tw"
      - "traefik.basic.port=8080"
      - "traefik.basic.protocol=http"

networks:
  web:
    external: true</code></pre>
<p>可以看到透過 <a href="https://docs.docker.com/config/labels-custom-metadata/">docker labels</a> 設定讓 traefik 直接讀取並且套用設定。啟動服務後可以看到 <code>acme.json</code> 已經存放了各個 host 的憑證資訊，未來只要將此檔案備份，就可以不用一直申請了。最後用 curl 來測試看看</p>
<p><a href="https://lh3.googleusercontent.com/IbO8svvvbHVwnBmBqt6hqNUs7uSwI9wbf8-lKw2VkVQr_xx41yXg1FmouE91EsuqtYHpJJYQcEHE8vrUptB-Nt1aomG8LYOi-Po1lzu65IFY3tFuBlE_ULpByxbqzQXHe7Kqk6PQx1E=w1920-h1080"><img src="https://lh3.googleusercontent.com/IbO8svvvbHVwnBmBqt6hqNUs7uSwI9wbf8-lKw2VkVQr_xx41yXg1FmouE91EsuqtYHpJJYQcEHE8vrUptB-Nt1aomG8LYOi-Po1lzu65IFY3tFuBlE_ULpByxbqzQXHe7Kqk6PQx1E=w1920-h1080" alt="" /></a></p>
<h2>心得</h2>
<p>由於 Traefik 可以自動讀取 docker label 內容，未來只需要維護 App 的 docker-compose 檔案，對於部署上面相當方便啊，透過底下指令就可以重新啟動容器設定</p>
<pre><code class="language-bash">$ docker-compose up -d --force-recreate --no-deps app</code></pre>
<p>如果對於自動化部署有興趣，可以參考我在 Udemy 上的線上課程</p>
<ul>
<li><a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG2019" title="Go 語言實戰">Go 語言實戰</a></li>
<li><a href="https://www.udemy.com/devops-oneday/?couponCode=DRONE" title="Drone CI/CD 實戰">Drone CI/CD 實戰</a></li>
</ul>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="6" data-poid="in-6777" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/lets-encrypt-support-wildcard-certificates-in-2018-01/" class="wp_rp_title">Let&#8217;s Encrypt 將在 2018 年一月支援 Wildcard Certificates</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6493" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/build-microservices-in-golang/" class="wp_rp_title">2016 COSCUP 用 Golang 寫 Microservices</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li></ul></div></div>