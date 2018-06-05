---
title: "Go 語言的 vendor 目錄"
date: 2018-05-05
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/05/what-is-vendor-in-golang/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/40093179410/in/dateposted-public/" title="Go-Logo_Blue"><img src="https://i1.wp.com/farm1.staticflickr.com/908/40093179410_53df4bb9e8_z.jpg?w=840&#038;ssl=1" alt="Go-Logo_Blue" data-recalc-dims="1" /></a>

很多朋友剛入門 <a href="https://golang.org">Go 語言時</a>，第一個會遇到的問題是，該如何設定專案配置，讓專案可以正常執行，在個人電腦該如何開發多個專案，這邊就會遇到該如何設定 <code>$GOPATH</code>，我在這邊跟大家講個觀念，開發環境只會有一個 <code>$GOPATH</code>，不管團隊內有多少專案，都是存放在同一個 GOPATH，避免每次開專案都要重新設定 <code>$GOPATH</code>，而專案內用到的相依性套件，請各自維護，透過<a href="https://github.com/golang/go/wiki/PackageManagementTools">官方提供的 wiki</a>，請選一套覺得好用的來使用吧，沒有最好的工具，找一套適合團隊是最重要的。

<span id="more-7017"></span>

<h2>什麼是 vendor</h2>

這邊不多說了，直接看影片教學最快了。

<iframe width="560" height="315" src="https://www.youtube.com/embed/DKqw_CvVklo" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<hr />

Go 語言線上課程目前特價 $1600，持續錄製中，每週都會有新的影片上架，歡迎大家參考看看，請點選底下購買連結:

<h1><a href="http://bit.ly/intro-golang">點我購買</a></h1>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6674" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/golang-dependency-management-tool-dep/" class="wp_rp_title">Go 語言官方推出的 dep 使用心得</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="1" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-6342" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/package-management-for-golang-glide/" class="wp_rp_title">Golang 套件管理工具 Glide</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="3" data-poid="in-6953" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/write-golang-in-aws-lambda/" class="wp_rp_title">在 AWS Lambda 上寫 Go 語言搭配 API Gateway</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="4" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6791" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/microservice-in-go/" class="wp_rp_title">用 Go 語言打造微服務架構</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6966" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/simple-queue-with-optimistic-concurrency-in-go/" class="wp_rp_title">用 Go 語言實現單一或多重 Queue 搭配 optimistic concurrency</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6899" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/migrate-nginx-to-caddy/" class="wp_rp_title">從 Nginx 換到 Caddy</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="8" data-poid="in-7013" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/init-func-in-golang/" class="wp_rp_title">Go 語言的 init 函式</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6796" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/downsize-go-binary-using-upx/" class="wp_rp_title">用 upx 壓縮 Go 語言執行擋</a><small class="wp_rp_comments_count"> (2)</small><br /></li></ul></div></div>