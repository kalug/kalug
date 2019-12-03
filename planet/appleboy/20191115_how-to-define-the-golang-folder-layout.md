---
title: "初探 Go 語言 Project Layout (新人必看)"
date: 2019-11-15
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/11/how-to-define-the-golang-folder-layout/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/pKaq_CvDy37QrubxGcYfXpOoORzOO0t1zJ0eSDpiyNzl0IlrbXeY3zNRGmBVUkK6QdjcfE514j2MxeNdVQRfl8S9wfdEmbeK54414LFUVZLSob62AVimIlmbI7qiQhH_mPjqNDZoL18=w1920-h1080" title="cover photo"><img src="https://lh3.googleusercontent.com/pKaq_CvDy37QrubxGcYfXpOoORzOO0t1zJ0eSDpiyNzl0IlrbXeY3zNRGmBVUkK6QdjcfE514j2MxeNdVQRfl8S9wfdEmbeK54414LFUVZLSob62AVimIlmbI7qiQhH_mPjqNDZoL18=w1920-h1080" alt="cover photo" title="cover photo" /></a></p>
<p>很多人初次進入 Go 語言，肯定都會尋找在 Go 裡面是否有一套標準且最多人使用的 Framework 來學習，但是在 Go 語言就是沒有這樣的標準，所有的開源專案架構目錄都是由各團隊自行設計，沒有誰對誰錯，也沒任何一個是最標準的。那你一定會問，怎樣才是最好的呢？很簡單，如果可以定義出一套結構是讓團隊所有成員可以一目瞭然的目錄結構，知道發生問題要去哪個地方找，要加入新的功能，就有相對應的目錄可以存放，那這個專案就是最好的。當然這沒有標準答案，只是讓團隊有個共識，未來有新人進入專案，可以讓他在最短時間內吸收整個專案架構。</p>
<span id="more-7549"></span>
<h2>投影片</h2>
<p>本次教學會著重在投影片 P5 ~ P20。</p>
<iframe src="//www.slideshare.net/slideshow/embed_code/key/dkaLirPqQf6D3V?startSlide=5" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
<h2>教學影片</h2>
<p>喜歡我的 Youtube 影片，可以訂閱 + 分享喔</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/jApleGS2hQY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ol>
<li>project layout 基本簡介 00:47</li>
<li>為什麼要用 <a href="https://blog.wu-boy.com/2018/10/go-1-11-support-go-module/comment-page-1/" title="go module">go module</a> 07:28</li>
<li>使用 Makefile  09:59</li>
<li>.env 使用情境  11:42</li>
<li>如何設定專案版本資訊 12:54</li>
</ol>
<p>未來會將投影片剩下的內容，錄製成影片放在 Udemy 平台上面，有興趣的可以直接參考底下:</p>
<ul>
<li><a href="https://www.udemy.com/course/golang-fight/?couponCode=20191201">Go 語言基礎實戰 (開發, 測試及部署)</a></li>
<li><a href="https://www.udemy.com/course/devops-oneday/?couponCode=20191201">一天學會 DevOps 自動化測試及部署</a></li>
</ul>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7523" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/job-queue-in-golang/" class="wp_rp_title">用 Go 語言實作 Job Queue 機制</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6493" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/build-microservices-in-golang/" class="wp_rp_title">2016 COSCUP 用 Golang 寫 Microservices</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="6" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6762" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/laravel-conf-in-taipei/" class="wp_rp_title">台灣第一屆 Laravel 研討會</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-6661" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/" class="wp_rp_title">用 Golang 寫 Command line 工具</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li></ul></div></div>