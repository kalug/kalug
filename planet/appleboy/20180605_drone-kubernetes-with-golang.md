---
title: "Drone 搭配 Kubernetes 部署 Go 語言項目"
date: 2018-06-05
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/27678088297/in/dateposted-public/" title="Screen Shot 2018-06-04 at 9.19.46 AM"><img src="https://i1.wp.com/farm2.staticflickr.com/1738/27678088297_1c6fe64e86_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-06-04 at 9.19.46 AM" data-recalc-dims="1" /></a>

在之前寫過一篇『<a href="https://blog.wu-boy.com/2017/10/upgrade-kubernetes-container-using-drone/">Drone 搭配 Kubernetes 升級應用程式版本</a>』，裡面內容最主要介紹  <a href="https://github.com/honestbee">honestbee</a> 撰寫的 <a href="https://drone.io">drone</a> 外掛: <a href="https://github.com/honestbee/drone-kubernetes">drone-kubernetes</a>，但是此外掛並非用 <a href="https://golang.org">Go 語言</a>所撰寫，而是用 Shell Script 透過 <code>kubectl set image</code> 方式來更新專案項目，但是這邊會有幾個缺點，第一點就是假設在 Develop 環境永遠都是吃 master 分支，也就是讀取 Image 的 <code>latest</code> 標籤，這時候此外掛就無法作用，第二點此外掛無法讀取 kubernetes YAML 檔案，假設專案要修正一個 ENV 值，此外掛也無法及時更新。綜合這兩點因素，只好捨棄此外掛，而本篇會帶給大家另一個用 Go 語言所撰寫的外掛，是由 <a href="https://github.com/Sh4d1">@Sh4d1</a> 所開發的<a href="https://github.com/Sh4d1/drone-kubernetes/">項目</a>，用法相當容易，底下會一步一步教大家如何部署 Go 語言項目。

<span id="more-7029"></span>

<h2>GitHub 工作流程及部署</h2>

<a href="https://www.flickr.com/photos/appleboy/42549008141/in/dateposted-public/" title="Screen Shot 2018-06-04 at 9.44.15 AM"><img src="https://i0.wp.com/farm2.staticflickr.com/1737/42549008141_e035c63057_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-06-04 at 9.44.15 AM" data-recalc-dims="1" /></a>

團隊只會有兩種環境，一種是 Staging 另一種則是 Production，而前者是根據只要 master 分支有變動，則會更新 Staging，而後者則需要下 Tag 才會正式部署到 Production，在 Drone 預設值內，是不開啟 Tag 事件，所以需自行到後台打開 (如下圖)，未來可以透過 drone-cli 用 command 方式打開，目前<a href="https://github.com/drone/drone-cli/pull/90">此功能</a>正在 Review 中。

<a href="https://www.flickr.com/photos/appleboy/41647040945/in/dateposted-public/" title="Snip20180604_6"><img src="https://i0.wp.com/farm2.staticflickr.com/1730/41647040945_0b938ab53a_z.jpg?w=840&#038;ssl=1" alt="Snip20180604_6" data-recalc-dims="1" /></a>

底下會來一步一步教大家如何設定 Drone。

<h2>準備 Go 項目</h2>

本篇會用 Go 語言寫個小型 Http 服務，來證明使用 tag 事件及 master 分支都可以正確部署，底下先看看 Go 的程式碼:

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;log&quot;
    &quot;net/http&quot;
    &quot;os&quot;
    &quot;strings&quot;
)

var version = &quot;master&quot;

func showVersion(w http.ResponseWriter, r *http.Request) {
    log.Println(version)
    w.Write([]byte(version))
}

func sayHello(w http.ResponseWriter, r *http.Request) {
    message := r.URL.Path
    message = strings.TrimPrefix(message, &quot;/&quot;)
    message = &quot;Hello, drone got the message: &quot; + message
    log.Println(message)
    w.Write([]byte(message))
}

func main() {
    // use PORT environment variable, or default to 8080
    port := &quot;8080&quot;
    if fromEnv := os.Getenv(&quot;PORT&quot;); fromEnv != &quot;&quot; {
        port = fromEnv
    }
    http.HandleFunc(&quot;/version&quot;, showVersion)
    http.HandleFunc(&quot;/&quot;, sayHello)
    log.Println(&quot;Listen server on &quot; + port + &quot; port&quot;)
    if err := http.ListenAndServe(&quot;:&quot;+port, nil); err != nil {
        log.Fatal(err)
    }
}
</pre>

從上面程式可以看到，在編譯 Go 語言專案時，可以從外部帶入 version 變數，證明目前的 App 版本。請參考 Makefile 內的

<pre class="brush: plain; title: ; notranslate">
build:
ifneq ($(DRONE_TAG),)
    go build -v -ldflags &quot;-X main.version=$(DRONE_TAG)&quot; -a -o release/linux/amd64/hello
else
    go build -v -ldflags &quot;-X main.version=$(DRONE_COMMIT)&quot; -a -o release/linux/amd64/hello
endif
</pre>

只要是 master 分支的 commit，就會執行 <code>-X main.version=$(DRONE_COMMIT)</code>，如果是 push tag 到伺服器，則會執行 <code>-X main.version=$(DRONE_TAG)</code>。最後看看 Drone 如何編譯

<pre class="brush: plain; title: ; notranslate">
pipeline:
  build_linux_amd64:
    image: golang:1.10
    group: build
    environment:
      - GOOS=linux
      - GOARCH=amd64
      - CGO_ENABLED=0
    commands:
      - cd example19-deploy-with-kubernetes &amp;&amp; make build
</pre>

記得將 <code>GOOS</code>, <code>GOARCH</code> 和 <code>CGO_ENABLED</code> 設定好。

<h2>上傳容器到 DockerHub</h2>

上一個步驟可以編譯出 linux 的二進制檔案，這時候就可以直接放到容器內直接執行:

<pre class="brush: plain; title: ; notranslate">
FROM plugins/base:multiarch

ADD example19-deploy-with-kubernetes/release/linux/amd64/hello /bin/

ENTRYPOINT [&quot;/bin/hello&quot;]
</pre>

其中 <code>plugins/base:multiarch</code> 用的是 docker scratch 最小 image 搭配 SSL 憑證檔案，接著把 go 編譯出來的二進制檔案放入，所以整體容器大小已經是最小的了。看看 drone 怎麼上傳到 <a href="https://hub.docker.com/">DockerHub</a>。

<pre class="brush: plain; title: ; notranslate">
  docker_golang:
    image: plugins/docker:17.12
    secrets: [ docker_username, docker_password ]
    repo: appleboy/golang-http
    dockerfile: example19-deploy-with-kubernetes/Dockerfile
    default_tags: true
    when:
      event: [ push, tag ]
</pre>

其中 <code>default_tags</code> 會自動將 <code>master</code> 分支上傳到 <code>latest</code> 標籤，而假設上傳 <code>1.1.1</code> 版本時，drone 則會幫忙編譯出三個不同的 tag 標籤，分別是 <code>1</code>, <code>1.1</code>, <code>1.1.1</code> 這是完全符合 <a href="https://semver.org/">Semantic Versioning</a>，如果有在開源專案打滾的朋友們，一定知道版本的重要性。而 Drone 在這地方提供了很簡單的設定讓開發者可以上傳一次 tag 做到三種不同的 image 標籤。

<h2>部署更新 Kubernetes</h2>

這邊推薦大家使用 <a href="https://github.com/Sh4d1/drone-kubernetes">Sh4d1/drone-kubernetes</a> 外掛，使用之前請先設定好三個參數:

<ol>
<li>KUBERNETES_SERVER</li>
<li>KUBERNETES_CERT</li>
<li>KUBERNETES_TOKEN</li>
</ol>

<code>KUBERNETES_SERVER</code> 可以打開家目錄底下的 <code>~/.kube/config</code> 檔案直接找到，cert 及 token 請先透過 pod 找到 secret token name:

<pre class="brush: plain; title: ; notranslate">
$ kubectl describe po/frontend-9f5ccc8d4-8n9xq | grep SecretName | grep token
    SecretName:  default-token-r5xdx
</pre>

拿到 secret name 之後，再透過底下指令找到 <code>ca.crt</code> 及 <code>token</code>

<pre class="brush: plain; title: ; notranslate">
$ kubectl get secret default-token-r5xdx -o yaml | egrep &#039;ca.crt:|token:&#039;
</pre>

其中 token 還需要透過 base64 decode 過，才可以設定到 drone secret。完成上述步驟後，可以來設定 drone 部署:

<pre class="brush: plain; title: ; notranslate">
  deploy:
    image: sh4d1/drone-kubernetes
    kubernetes_template: example19-deploy-with-kubernetes/deployment.yml
    kubernetes_namespace: default
    secrets: [ kubernetes_server, kubernetes_cert, kubernetes_token ]
</pre>

其中 <code>deployment.yml</code> 就是該服務的 deploy 檔案:

<pre class="brush: plain; title: ; notranslate">
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: frontend
  # these labels can be applied automatically
  # from the labels in the pod template if not set
  labels:
    app: gotraining
    tier: frontend
spec:
  # this replicas value is default
  # modify it according to your case
  replicas: 3
  # selector can be applied automatically
  # from the labels in the pod template if not set
  # selector:
  #   app: guestbook
  #   tier: frontend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  minReadySeconds: 5
  template:
    metadata:
      labels:
        app: gotraining
        tier: frontend
    spec:
      containers:
      - name: go-hello
        image: appleboy/golang-http:VERSION
        imagePullPolicy: Always
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 8080
        env:
        - name: FOR_GODS_SAKE_PLEASE_REDEPLOY
          value: &#039;THIS_STRING_IS_REPLACED_DURING_BUILD&#039;
</pre>

大家可以找到 <code>image: appleboy/golang-http:VERSION</code>，這邊需要寫個 sed 指令來取代 <code>VERSION</code>，部署到 staging 則是 <code>latest</code>，如果是 tag 則取代為 <code>DRONE_TAG</code>

<pre class="brush: plain; title: ; notranslate">
ifneq ($(DRONE_TAG),)
    VERSION ?= $(DRONE_TAG)
else
    VERSION ?= latest
endif

prepare:
    sed -ie &quot;s/VERSION/$(VERSION)/g&quot; deployment.yml
</pre>

這邊有個問題就是，我們怎麼讓在同一個 image:latest 下，也可以保持更新 App 呢，首先必須設定 <code>imagePullPolicy</code> 為 <code>Always</code>，以及設定一個 env 讓 drone 可以動態修改 template 檔案

<pre class="brush: plain; title: ; notranslate">
        env:
        - name: FOR_GODS_SAKE_PLEASE_REDEPLOY
          value: &#039;THIS_STRING_IS_REPLACED_DURING_BUILD&#039;
</pre>

目的是讓每次 kubernetes 都可以讀取不一樣的 template 確保 image 都可以即時更新，假設少了上述步驟，是無法讓 staging 保持更新狀態。畢竟使用 kubectl apply 時，如果 yaml 檔案是沒有更動過的，就不會更新。

<pre class="brush: plain; title: ; notranslate">
prepare:
    sed -ie &quot;s/VERSION/$(VERSION)/g&quot; deployment.yml
    sed -ie &quot;s/THIS_STRING_IS_REPLACED_DURING_BUILD/$(shell date)/g&quot; deployment.yml
    cat deployment.yml
</pre>

而 Tag 就不用擔心，原因就是 <code>VERSION</code> 就會改變不一樣的值，所以肯定會即時更新，那假設團隊想要上傳相同 tag (這是不好的做法，請盡量不要使用)，這時候動態修改 env 的作法就發揮功效了。從上面的教學，現在我們看安新的透過 GitHub Flow 來完成部署 Staging 及 Production 了。

<h2>影片簡介</h2>

下面影片並無包含實作部分，會介紹我在團隊怎麼使用 <a href="https://guides.github.com/introduction/flow/">GitHub Flow</a> 部署，更多實作詳細細節，可以參考 Udemy 上面影片

<iframe width="560" height="315" src="https://www.youtube.com/embed/qLla47eJUQc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<h2>心得</h2>

作者我尚未深入玩過 <a href="https://about.gitlab.com/features/gitlab-ci-cd/">GitLab CI</a> 或者是 <a href="https://jenkins.io/">Jenkins</a> 搭配 Kubernetes 來部署專案，但是我相信以複雜及學習難度來說，用 Drone CI 是比較簡單的，這部分就不多說了，大家實際操作比較過才知道。希望能帶給有在玩 Drone 的開發者有些幫助。另外我在 Udemy 上面開了兩門課程，一門 drone 另一門 golang 教學，如果對這兩門課有興趣的話，都可以購買，目前都是特價 $1800

<ul>
<li><a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-TOP">Go 語言實戰</a> $1800</li>
<li><a href="https://www.udemy.com/devops-oneday/?couponCode=DRONE-DEVOPS">一天學會 DEVOPS 自動化流程</a> $1800</li>
</ul>

如果兩們都有興趣想一起合買，請直接匯款到下面帳戶，特價 <strong>$3000</strong>

<ul>
<li>富邦銀行: 012</li>
<li>富邦帳號: 746168268370</li>
<li>匯款金額: 台幣 $3000 元</li>
</ul>

匯款後請直接到 <a href="http://facebook.com/appleboy46">FB 找我</a>，或者直接寫信給我也可以 <strong>appleboy.tw AT gmail.com</strong>。有任何問題都可以直接加我 FB，都是公開資訊。
<div class="wp_rp_wrap  wp_rp_plain" id="wp_rp_first"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6846" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/10/upgrade-kubernetes-container-using-drone/" class="wp_rp_title">Drone 搭配 Kubernetes 升級應用程式版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="1" data-poid="in-6825" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/drone-on-kubernetes-on-aws/" class="wp_rp_title">用 Kubernetes 將 Drone CI/CD 架設在 AWS</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="4" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="8" data-poid="in-7006" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/" class="wp_rp_title">[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>