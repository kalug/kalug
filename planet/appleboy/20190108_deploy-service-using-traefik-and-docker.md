---
title: "用 Traefik 搭配 Docker 快速架設服務"
date: 2019-01-08
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/
layout: post
comments: true
---

<p><strong>更新: 2019.01.10 新增教學影片</strong></p>
<p><a href="https://lh3.googleusercontent.com/TAK3Xi-hQKY1RCRGFLWmUGwdhP8UdI5mrWDyV5rQstQaQMDa27Fp0JOX2lezArNrZEdX227TyajH9wmVO3geDSFGQH9QBU4MANFSCBmPnlL2_eEehszF2tPhm1NNv1xYiCgiSM6air8=w1920-h1080" title="drone traefik docker deploy"><img src="https://lh3.googleusercontent.com/TAK3Xi-hQKY1RCRGFLWmUGwdhP8UdI5mrWDyV5rQstQaQMDa27Fp0JOX2lezArNrZEdX227TyajH9wmVO3geDSFGQH9QBU4MANFSCBmPnlL2_eEehszF2tPhm1NNv1xYiCgiSM6air8=w1920-h1080" alt="drone traefik docker deploy" title="drone traefik docker deploy" /></a></p>
<p>相信大家在架設服務肯定會選一套像是 <a href="http://www.haproxy.org/">HAProxy</a>, <a href="https://www.nginx.com/" title="Nginx">Nginx</a>, <a href="https://httpd.apache.org/" title="Apache">Apache</a> 或 <a href="https://caddyserver.com/" title="Caddy">Caddy</a>，這四套架設的難度差不多，如果要搭配 <a href="https://letsencrypt.org/" title="Let&#039;s Encrypt">Let&#8217;s Encrypt</a> 前面兩套需要自己串接 (Nginx, Apache)，而 Caddy 是用 <a href="https://golang.org/" title="Golang">Golang</a> 開發裡面已經內建了 Let&#8217;s Encrypt，，管理者不用擔心憑證過期，相當方便。但是本篇我要介紹另外一套工具叫 <a href="https://traefik.io/" title="Traefik">Traefik</a>，這一套也是用 Go 語言開發，而我推薦這套的原因是，此套可以跟 Docker 很深度的結合，只要服務跑在 Docker 上面，Traefik 都可以自動偵測到，並且套用設定。透過底下的範例讓 Traefik 串接後端兩個服務，分別是 <code>domain1.com</code> 及 <code>domain2.com</code>。來看看如何快速設定 Traefik。</p>
<p><a href="https://lh3.googleusercontent.com/e4VvNhQLdG0agSrE3EbxYURmbZevK8kVUaBhvHE3FVg_9iCRFeDFdFo9PHEm9EGPkYX2Q-ZmdcwyJhsDRbPi0HdZIN1HRjdkgFI8mWrbVWPLscPKI2WxCDIlSkCzB2zoh6pay-3R2Xg=w1920-h1080" title="traefik + docker + golang"><img src="https://lh3.googleusercontent.com/e4VvNhQLdG0agSrE3EbxYURmbZevK8kVUaBhvHE3FVg_9iCRFeDFdFo9PHEm9EGPkYX2Q-ZmdcwyJhsDRbPi0HdZIN1HRjdkgFI8mWrbVWPLscPKI2WxCDIlSkCzB2zoh6pay-3R2Xg=w1920-h1080" alt="traefik + docker + golang" title="traefik + docker + golang" /></a></p>
<span id="more-7193"></span>
<h2>影片教學</h2>
<p>不想看內文的，可以直接參考 Youtube 影片，如果喜歡的話歡迎訂閱</p>
<iframe width="640" height="360" src="https://www.youtube.com/embed/0GkJb6-CDUU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h2>撰寫服務</h2>
<p>我們先透過底下 Go 語言實作後端，並且放到 <a href="https://hub.docker.com" title="Docker Hub">Docker Hub</a> 內，方便之後透過 <a href="https://docs.docker.com/compose/" title="docker-compose">docker-compose</a> 設定。</p>
<pre><code class="language-go">package main

import (
    "flag"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"
)

// HelloWorld for hello world
func HelloWorld() string {
    return "Hello World, golang workshop!"
}

func handler(w http.ResponseWriter, r *http.Request) {
    log.Printf("Got http request. time: %v", time.Now())
    fmt.Fprintf(w, "I love %s!", r.URL.Path[1:])
}

func pinger(port string) error {
    resp, err := http.Get("http://localhost:" + port)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    if resp.StatusCode != 200 {
        return fmt.Errorf("server returned not-200 status code")
    }

    return nil
}

func main() {
    var port string
    var ping bool
    flag.StringVar(&amp;port, "port", "8080", "server port")
    flag.StringVar(&amp;port, "p", "8080", "server port")
    flag.BoolVar(&amp;ping, "ping", false, "check server live")
    flag.Parse()

    if p, ok := os.LookupEnv("PORT"); ok {
        port = p
    }

    if ping {
        if err := pinger(port); err != nil {
            log.Printf("ping server error: %v\n", err)
        }

        return
    }

    http.HandleFunc("/", handler)
    log.Println("http server run on " + port + " port")
    log.Fatal(http.ListenAndServe(":"+port, nil))
}</code></pre>
<p>撰寫 Dockerfile</p>
<pre><code class="language-yaml">FROM alpine:3.8

LABEL maintainer="Bo-Yi Wu &lt;appleboy.tw@gmail.com&gt;" \
  org.label-schema.name="Drone Workshop" \
  org.label-schema.vendor="Bo-Yi Wu" \
  org.label-schema.schema-version="1.0"

RUN apk add --no-cache ca-certificates &amp;&amp; \
  rm -rf /var/cache/apk/*

ADD release/linux/i386/helloworld /bin/

ENTRYPOINT ["/bin/helloworld"]</code></pre>
<p>設定 <a href="http://cloud.drone.io" title="Drone">Drone</a> 自動上傳到 DockerHub，使用 <a href="https://github.com/drone/drone-docker" title="drone-docker">drone-docker</a> 外掛。</p>
<pre><code class="language-yaml">  - name: publish
    image: plugins/docker:17.12
    settings:
      repo: appleboy/test
      auto_tag: true
      dockerfile: Dockerfile.alpine
      default_suffix: alpine
      username:
        from_secret: docker_username
      password:
        from_secret: docker_password
    when:
      event:
        - push
        - tag</code></pre>
<p>其中 <code>docker_username</code> 及 <code>docker_password</code> 可以到 drone 後台設定。</p>
<h2>啟動 Traefik 服務</h2>
<p>如果只是單純綁定在非 80 或 443 port，您可以用一般帳號設定 Traefik，設定如下:</p>
<pre><code class="language-toml">debug = false

logLevel = "INFO"
defaultEntryPoints = ["http"]

[entryPoints]
  [entryPoints.http]
  address = ":8080"

[retry]

################################################################
# Docker Provider
################################################################

# Enable Docker Provider.
[docker]

# Docker server endpoint. Can be a tcp or a unix socket endpoint.
#
# Required
#
endpoint = "unix:///var/run/docker.sock"

# Enable watch docker changes.
#
# Optional
#
watch = true</code></pre>
<p>上面設定可以看到將 Traefik 啟動在 <code>8080</code> port，並且啟動 Docker Provider，讓 Traefik 可以自動偵測目前 Docker 啟動了哪些服務。底下是啟動 Traefik 的 docker-compose 檔案</p>
<pre><code class="language-yaml">version: '2'

services:
  traefik:
    image: traefik
    restart: always
    ports:
      - 8080:8080
      # - 80:80
      # - 443:443
    networks:
      - web
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.toml:/traefik.toml
      # - ./acme.json:/acme.json
    container_name: traefik

networks:
  web:
    external: true</code></pre>
<p>啟動 Traefik 環境前需要建立虛擬網路名叫 web</p>
<pre><code class="language-bash">$ docker network create web
$ docker-compose up -d</code></pre>
<h2>啟動 App 服務</h2>
<p>接著只要透過 docker-compose 來啟動您的服務</p>
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
      - "traefik.basic.frontend.rule=Host:domain1.com"
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
      - "traefik.basic.frontend.rule=Host:domain2.com"
      - "traefik.basic.port=8080"
      - "traefik.basic.protocol=http"

networks:
  web:
    external: true</code></pre>
<p>大家可以清楚看到透過設定 docker label 可以讓 Traefik 自動偵測到系統服務</p>
<pre><code class="language-yaml">    labels:
      - "traefik.docker.network=web"
      - "traefik.enable=true"
      - "traefik.basic.frontend.rule=Host:domain2.com"
      - "traefik.basic.port=8080"
      - "traefik.basic.protocol=http"</code></pre>
<p>其中 <code>traefik.basic.frontend.rule</code> 可以填入網站 DNS Name，另外 <code>traefik.basic.port=8080</code> 則是服務預設啟動的 port (在 Go 語言內實作)。</p>
<p>驗證網站是否成功</p>
<pre><code class="language-bash">$ curl -v http://domain1.com:8080/test
$ curl -v http://domain2.com:8080/test</code></pre>
<p><a href="https://lh3.googleusercontent.com/8RGL4EBCr8LDqhjc0y5l0o4UYTBbRY-CLbd_RKJl_PPbjr2LkgEYAc7Y7WuFxjXWKXC9OMZVi1jSV1JL18pAdRGG7PGwOi1UssZN0a-BqURPDSIZlU0X9EUlbMp7X2u_Y0qYY9DHtYw=w1920-h1080" title="bash screen"><img src="https://lh3.googleusercontent.com/8RGL4EBCr8LDqhjc0y5l0o4UYTBbRY-CLbd_RKJl_PPbjr2LkgEYAc7Y7WuFxjXWKXC9OMZVi1jSV1JL18pAdRGG7PGwOi1UssZN0a-BqURPDSIZlU0X9EUlbMp7X2u_Y0qYY9DHtYw=w1920-h1080" alt="bash screen" title="bash screen" /></a></p>
<h2>搭配 Let&#8217;s Encrypt</h2>
<p>這邊又要感謝 Go 語言內建 Let&#8217;s Encrypt 套件，讓 Go 開發者可以快速整合憑證，這邊只需要修正 Traefik 服務設定檔</p>
<pre><code class="language-toml">logLevel = "INFO"
defaultEntryPoints = ["https","http"]

[entryPoints]
  [entryPoints.http]
  address = ":80"
    [entryPoints.http.redirect]
    entryPoint = "https"
  [entryPoints.https]
  address = ":443"
  [entryPoints.https.tls]

[retry]

[docker]
endpoint = "unix:///var/run/docker.sock"
watch = true
exposedByDefault = false

[acme]
email = "appleboy.tw@gmail.com"
storage = "acme.json"
entryPoint = "https"
onHostRule = true
[acme.httpChallenge]
entryPoint = "http"</code></pre>
<p>跟之前 Traefik 比較多了 <code>entryPoints</code> 及 <code>acme</code>，另外在 docker-compose 內要把 80 及 443 port 啟動，並且將 acme.json 掛載進去</p>
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
      - ./traefik.toml:/traefik.toml
      - ./acme.json:/acme.json
    container_name: traefik

networks:
  web:
    external: true</code></pre>
<p>其中先建立 <code>acme.json</code> 並且設定權限為 600</p>
<pre><code class="language-bash">$ touch acme.json
$ chmod 600 acme.json</code></pre>
<p>再重新啟動 Traefik 服務</p>
<pre><code class="language-bash">$ docker-compose down
$ docker-compose up -d</code></pre>
<p>最後只要改 <code>traefik.basic.frontend.rule</code> 換成真實的 Domain，你會發現 Traefik 會將憑證內容寫入 acme.json。這也為什麼我們需要將 acme.json 建立在 Host 空間上。</p>
<h2>搭配 Drone 自動化更新服務</h2>
<p>未來所有服務都可以透過 docker-compose 來啟動，所以只要透過 Drone 將 一些 yaml 設定檔案傳到服務器即可</p>
<pre><code class="language-yaml">  - name: scp
    image: appleboy/drone-scp
    pull: true
    settings:
      host: demo1.com
      username: deploy
      key:
        from_secret: deploy_key
      target: /home/deploy/gobento
      rm: true
      source:
        - release/*
        - Dockerfile
        - docker-compose.yml</code></pre>
<p>上面將檔案丟到遠端機器後，再透過 ssh 編譯並且部署</p>
<pre><code class="language-yaml">  - name: ssh
    image: appleboy/drone-ssh
    pull: true
    settings:
      host: console.gobento.co
      user: deploy
      key:
        from_secret: deploy_key
      target: /home/deploy/demo
      rm: true
      script:
        - cd demo &amp;&amp; docker-compose build
        - docker-compose up -d --force-recreate --no-deps demo
        - docker images --quiet --filter=dangling=true | xargs --no-run-if-empty docker rmi -f</code></pre>
<h2>心得</h2>
<p>本篇教大家一步一步建立 Traefik 搭配 Docker，相對於 Nginx 我覺得簡單非常多，尤其時可以在 docker-compose 內設定 docker Label，而 Traefik 會自動偵測設定，並且重新啟動服務。希望這篇對於想要快速架設網站的開發者有幫助。如果您有在用 <a href="https://aws.amazon.com/tw/" title="AWS 服務">AWS 服務</a>，想省錢可以使用 Traefik 幫您省下一台 <a href="https://aws.amazon.com/tw/elasticloadbalancing/" title="ALB 或 ELB">ALB 或 ELB</a> 的費用。最後補充一篇效能文章：『<a href="https://zhuanlan.zhihu.com/p/41354937" title="NGINX、HAProxy和Traefik负载均衡能力对比">NGINX、HAProxy和Traefik负载均衡能力对比</a>』有興趣可以參考一下。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7217" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/" class="wp_rp_title">Traefik 搭配 Docker 自動更新 Let&#8217;s Encrypt 憑證</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="1" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="2" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-7132" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/drone-cloud-service/" class="wp_rp_title">Drone CI/CD 推出 Cloud 服務支援開源專案</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="4" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="5" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7280" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/" class="wp_rp_title">開源專案 Gitea 支援 OAuth Provider</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>