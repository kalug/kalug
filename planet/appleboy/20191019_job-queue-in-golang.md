---
title: "用 Go 語言實作 Job Queue 機制"
date: 2019-10-19
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/10/job-queue-in-golang/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" title="golang logo"><img src="https://lh3.googleusercontent.com/jsocHCR9A9yEfDVUTrU0m42_aHhTEVDGW5p5PsQSx7GSlkt3gLjohfXH3S7P7p982332ruU_e-EtW0LwmiuZjvN65VIcyME-zE35C6EM0IV1nqY6KoNw3dwW2djjid3F-T5YgnJothA=w1920-h1080" alt="golang logo" title="golang logo" /></a></p>
<p>很高興可以在 <a href="https://mopcon.org/2019/">Mopcon</a> 分享『用 <a href="https://golang.org">Go 語言</a>實現 Job Queue 機制』，透過簡單的 <a href="https://tour.golang.org/concurrency/1">goroutine</a> 跟 <a href="https://tour.golang.org/concurrency/2">channel</a> 就可以實現簡單 Queue 機制，並且限制同時可以執行多少個 Job，才不會讓系統超載。最後透過編譯放進 Docker 容器內，就可以跑在各種環境上，加速客戶安裝及部署。</p>
<span id="more-7523"></span>
<h2>議程大綱</h2>
<p>本次大致上整理底下幾個重點:</p>
<ol>
<li>What is the different unbuffered and buffered channel?</li>
<li>How to implement a job queue in golang?</li>
<li>How to stop the worker in a container?</li>
<li>Shutdown with Sigterm Handling.</li>
<li>Canceling Workers without Context.</li>
<li>Graceful shutdown with worker.</li>
<li>How to auto-scaling build agent?</li>
<li>How to cancel the current Job?</li>
</ol>
<p>由於在投影片內也許寫得不夠詳細，所以我打算錄製一份影片放在 Udemy 教學影片上，如果有興趣可以參考底下影片連結:</p>
<ul>
<li><a href="https://www.udemy.com/course/golang-fight/?couponCode=GOLANG201911">Go 語言基礎實戰 (開發, 測試及部署)</a></li>
<li><a href="https://www.udemy.com/course/devops-oneday/?couponCode=DEVOPS201911">一天學會 DevOps 自動化測試及部署</a></li>
</ul>
<p>之前的教學影片也可以直接參考底下連結:</p>
<ul>
<li><a href="https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/">15 分鐘學習 Go 語言如何處理多個 Channel 通道</a></li>
<li><a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/">用五分鐘了解什麼是 unbuffered vs buffered channel</a></li>
</ul>
<h2>投影片</h2>
<iframe src="//www.slideshare.net/slideshow/embed_code/key/yUApXXKrTLWXw2" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/appleboy/job-queue-in-golang-184064840" title="Job Queue in Golang" target="_blank">Job Queue in Golang</a> </strong> from <strong><a href="https://www.slideshare.net/appleboy" target="_blank">Bo-Yi Wu</a></strong> </div>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7534" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/implement-job-queue-using-buffer-channel-in-golang/" class="wp_rp_title">用 Go 語言 buffered channel 實作 Job Queue</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7549" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/11/how-to-define-the-golang-folder-layout/" class="wp_rp_title">初探 Go 語言 Project Layout (新人必看)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6493" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/build-microservices-in-golang/" class="wp_rp_title">2016 COSCUP 用 Golang 寫 Microservices</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="5" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7330" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/understand-unbuffered-vs-buffered-channel-in-five-minutes/" class="wp_rp_title">用五分鐘了解什麼是 unbuffered vs buffered channel</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6661" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/" class="wp_rp_title">用 Golang 寫 Command line 工具</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="8" data-poid="in-7384" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/05/handle-multiple-channel-in-15-minutes/" class="wp_rp_title">15 分鐘學習 Go 語言如何處理多個 Channel 通道</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="9" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>