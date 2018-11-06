---
title: "高雄 Mopcon 濁水溪以南最大研討會 – Drone CI/CD 介紹"
date: 2018-11-06
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/11/drone-ci-cd-platform-in-mopconf/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/45693842842/in/dateposted-public/" title="Screen Shot 2018-11-06 at 1.16.22 PM"><img src="https://i1.wp.com/farm2.staticflickr.com/1948/45693842842_d5fb6105b5_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-11-06 at 1.16.22 PM" data-recalc-dims="1" /></a>

今年又以講者身份參加 <a href="https://mopcon.org">Mopcon</a> 南區最大研討會，此次回高雄最主要推廣 <a href="https://github.com/drone/drone">Drone</a> 這套 CI/CD 平台。大家可以從過去的 Blog 或影片可以知道我在北部推廣了很多次 Drone 開源軟體，唯獨南台灣還沒講過，所以透過 Mopcon 研討會終於有機會可以來推廣了。本次把 Drone 的架構圖畫出來，如何架設在 <a href="https://kubernetes.io/">Kubernetes</a> 上以及該如何擴展 drone agent，有興趣的可以參考底下投影片:

<span id="more-7113"></span>

<h2>投影片</h2>

<iframe src="//www.slideshare.net/slideshow/embed_code/key/z47uI70IZxgu5a" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

<div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/appleboy/drone-cicd-platform" title="Drone CI/CD Platform" target="_blank">Drone CI/CD Platform</a> </strong> from <strong><a href="https://www.slideshare.net/appleboy" target="_blank">Bo-Yi Wu</a></strong> </div>

很高興 Drone 在今年宣佈支援 <a href="https://www.arm.com/">ARM</a> 及 Windows 兩大平台，而我也正在把一些 drone 的 plugin 支援 ARM 及 Windows，相信在 Drone 0.9 版正式推出後，就可以讓 Windows 使用者架設在 <a href="https://azure.microsoft.com/zh-tw/">Microsoft Azure</a>。
<div class="wp_rp_wrap  wp_rp_plain" id="wp_rp_first"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6825" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/drone-on-kubernetes-on-aws/" class="wp_rp_title">用 Kubernetes 將 Drone CI/CD 架設在 AWS</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-6846" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/10/upgrade-kubernetes-container-using-drone/" class="wp_rp_title">Drone 搭配 Kubernetes 升級應用程式版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7108" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/deploy-app-to-aws-lambda-using-up-tool-in-ten-minutes/" class="wp_rp_title">用 10 分鐘部署專案到 AWS Lambda</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6762" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/laravel-conf-in-taipei/" class="wp_rp_title">台灣第一屆 Laravel 研討會</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="7" data-poid="in-7006" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/" class="wp_rp_title">[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7056" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/drone-with-hashicorp-packer/" class="wp_rp_title">用 Drone CI/CD 整合 Packer 自動產生 GCP 或 AWS 映像檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6786" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/2017-coscup-introduction-to-gitea-drone/" class="wp_rp_title">2017 COSCUP 研討會: Gitea + Drone 介紹</a><small class="wp_rp_comments_count"> (4)</small><br /></li></ul></div></div>