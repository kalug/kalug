---
title: "用 10 分鐘部署專案到 AWS Lambda"
date: 2018-10-25
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/10/deploy-app-to-aws-lambda-using-up-tool-in-ten-minutes/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/43711539730/in/dateposted-public/" title="Screen Shot 2018-10-24 at 9.37.49 AM"><img src="https://i1.wp.com/farm2.staticflickr.com/1956/43711539730_7bd9f610c3_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-10-24 at 9.37.49 AM" data-recalc-dims="1" /></a>

看到這標題也許非常聳動，也可能覺得不可思議，今天來探討如何將專案直接部署到 <a href="https://aws.amazon.com/tw/lambda/">AWS Lambda</a> 並且自動化將 <a href="https://aws.amazon.com/tw/api-gateway/">API Gateway</a> 設定完成。當然要做到完全自動化，必須要使用一些工具才能完成，本篇將介紹由 <a href="https://github.com/tj">TJ</a> 所開發的 <a href="https://github.com/apex/up">apex/up</a> 工具，如果您不熟悉 EC2 也不太懂 Command line 操作，本文非常適合您，不需要管理任何 EC2 機器，也不需要在熟悉任何 Linux Command 就可以完成簡單的專案部署。首先為什麼我選擇 apex/up 而不是選擇 <a href="https://github.com/apex/apex">apex/apex</a>，原因是使用 up 工具，您的專案是不用更動任何程式碼，就可以將專案直接執行在 AWS Lambda，那 API Gateway 部分也會一並設定完成，將所有 Request 直接 Proxy 到該 Lambda function。如果您希望對於 AWS Lambda 有更多進階操作，我會建議您用 <a href="https://github.com/apex/apex">apex/apex</a> 或 <a href="https://serverless.com/">Serverless</a>。您可以想像使用 up 就可以將 AWS Lambda 當作小型的 EC2 服務，但是不用自己管理 EC2，現在 up 支援 <a href="https://golang.org">Golang</a>, <a href="https://nodejs.org/en/">Node.js</a>, <a href="https://www.python.org/">Python</a> 或 Java 程式語言，用一行 command 就可以將專案部署到雲端了。

<span id="more-7108"></span>

<h2>影片教學</h2>

<iframe width="640" height="360" src="https://www.youtube.com/embed/Z2vp-L3bZwU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

本系列影片不只有介紹 up 工具，還包含『設定 custom domain 在 API Gateway』及『用 drone 搭配 apex/up 自動化部署 AWS Lambda』。有興趣可以參考底下:

<ul>
<li>使用 apex/up 工具部署 Go 專案到 AWS Lambda <a href="https://www.youtube.com/watch?v=Z2vp-L3bZwU">Youtube</a>, <a href="https://www.udemy.com/golang-fight/learn/v4/t/lecture/12246918">Udemy</a></li>
<li>設定 Custom Domain Names 在 API Gateway 上 <a href="https://www.udemy.com/golang-fight/learn/v4/t/lecture/12249324">Udemy</a></li>
<li>用 drone-apex-up 自動化更新 Go 專案到 AWS Lambda <a href="https://www.udemy.com/golang-fight/learn/v4/t/lecture/12270902">Udemy</a></li>
</ul>

買了結果沒興趣想退費怎麼辦？沒關係，在 Udemy 平台 30 天內都可以全額退費，所以不用擔心買了後悔。如果你對 Go 語言 (現在 $1800) 及 Drone 自動化部署 (現在 $1800) 都有興趣，想要一起購買，你可以直接匯款到底下帳戶，有合購優惠價

<ul>
<li>富邦銀行: 012</li>
<li>富邦帳號: 746168268370</li>
<li>匯款金額: 台幣 $3400 元</li>
</ul>

<h2>使用 up 工具</h2>

<a href="https://up.docs.apex.sh/#introduction">up</a> 可以在幾秒鐘的時間將專案直接部署到 AWS Lambda，透過 up 可以快速將 Staging 及 Productoon 環境建置完成。底下直接用 GO 語言當例子。

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;os&quot;

    &quot;github.com/gin-gonic/gin&quot;
)

func main() {
    port := &quot;:&quot; + os.Getenv(&quot;PORT&quot;)
    stage := os.Getenv(&quot;UP_STAGE&quot;)

    r := gin.Default()
    r.GET(&quot;/&quot;, func(c *gin.Context) {
        c.JSON(200, gin.H{
            &quot;message&quot;: &quot;pong &quot; + stage,
        })
    })

    r.GET(&quot;/v1&quot;, func(c *gin.Context) {
        c.JSON(200, gin.H{
            &quot;message&quot;: &quot;pong &quot; + stage + &quot; v1 ++ drone&quot;,
        })
    })

    r.Run(port)
}
</pre>

接著在專案內放置 <code>up.json</code> 檔案，內容如下:

<pre class="brush: plain; title: ; notranslate">
{
  &quot;name&quot;: &quot;demo&quot;,
  &quot;profile&quot;: &quot;default&quot;,
  &quot;regions&quot;: [
    &quot;ap-southeast-1&quot;
  ]
}
</pre>

<code>name</code> 代表 aws lambda 函數名稱，<code>profile</code> 會讀 <code>~/.aws/credentials</code> 底下的 profile 設定。接著執行 <code>up -v</code>

<pre class="brush: plain; title: ; notranslate">
$ up -v
</pre>

<a href="https://www.flickr.com/photos/appleboy/45494403542/in/dateposted-public/" title="up_json_—_training"><img src="https://i1.wp.com/farm2.staticflickr.com/1963/45494403542_a91463e6cc_z.jpg?w=840&#038;ssl=1" alt="up_json_—_training" data-recalc-dims="1" /></a>

從上圖可以看到預設編譯行為是

<pre class="brush: plain; title: ; notranslate">
$ GOOS=linux GOARCH=amd64 go build -o server *.go
</pre>

並且上傳完成後會將 <code>server</code> 移除。登入 AWS Lambda 入口，可以看到 up 幫忙建立了兩個環境，一個是 <code>staging</code> 另一個是 <code>production</code>，假設要部署專案到 production 環境可以下

<pre class="brush: plain; title: ; notranslate">
$ up deploy production -v
</pre>

部署完成後，可以直接透過 up 拿到 API Gateway 給的測試 URL，可以在瀏覽器瀏覽

<pre class="brush: plain; title: ; notranslate">
$ up url
https://xxxxxxx.execute-api.ap-southeast-1.amazonaws.com/staging/
</pre>

當然也可以到 API Gateway 那邊設定好 Custom Domain 就可以直接用自己的 Domain，而不會有 <code>/staging/</code> 字眼在 URL 路徑上。

<h2>搭配 Drone 自動化部署</h2>

在自己電腦測試完成後，接著要設定 CI/CD 來達到自動化部署，本文直接拿 <a href="https://github.com/drone/drone">Drone</a> 來串接。底下是 .drone.yml 設定檔

<pre class="brush: plain; title: ; notranslate">
pipeline:
  build:
    image: golang:1.11
    pull: true
    environment:
      TAGS: sqlite
      GO111MODULE: &quot;on&quot;
    commands:
      - cd example23-deploy-go-application-with-up &amp;&amp; GOOS=linux GOARCH=amd64 go build -o server *.go
  up:
    image: appleboy/drone-apex-up
    pull: true
    secrets: [aws_secret_access_key, aws_access_key_id]
    stage:
      - staging
    directory: ./example23-deploy-go-application-with-up
    when:
      event: push
      branch: master

  up:
    image: appleboy/drone-apex-up
    pull: true
    secrets: [aws_secret_access_key, aws_access_key_id]
    stage:
      - production
    directory: ./example23-deploy-go-application-with-up
    when:
      event: tag
</pre>

上面可以很清楚看到，只要是 push 到 master branch 就會觸發 staging 環境部署。而下 Tag 則是部署到 Production。要注意的是由於 up 會有預設編譯行為，但是專案複雜的話就需要透過其他指令去執行。只要去蓋掉預設行為就可以。

<pre class="brush: plain; title: ; notranslate">
{
  &quot;name&quot;: &quot;demo&quot;,
  &quot;profile&quot;: &quot;default&quot;,
  &quot;regions&quot;: [
    &quot;ap-southeast-1&quot;
  ],
  &quot;hooks&quot;: {
    &quot;build&quot;: [
      &quot;up version&quot;
    ],
    &quot;clean&quot;: [
    ]
  }
}
</pre>

看到 <code>hooks</code> 階段，其中 build 部分需要填寫，不可以是空白。

<h2>心得</h2>

如果您想快速的架設好 API 後端，或者是靜態網站，我相信 up 是一套不錯的工具，可以快速架設好開發或測試環境。而且可以省下不少開 EC2 費用，如果有興趣的話大家可以參考看看 up 工具。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6953" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/write-golang-in-aws-lambda/" class="wp_rp_title">在 AWS Lambda 上寫 Go 語言搭配 API Gateway</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="1" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="5" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6617" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/12/send-line-message-using-drone-line/" class="wp_rp_title">用 drone-line 架設 Line webhook 及發送訊息</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="8" data-poid="in-7056" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/drone-with-hashicorp-packer/" class="wp_rp_title">用 Drone CI/CD 整合 Packer 自動產生 GCP 或 AWS 映像檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6907" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/downsize-node-modules-with-golang/" class="wp_rp_title">用 Go 語言減少 node_modules 容量來加速部署</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>