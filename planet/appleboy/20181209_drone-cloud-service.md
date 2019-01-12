---
title: "Drone CI/CD 推出 Cloud 服務支援開源專案"
date: 2018-12-09
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/12/drone-cloud-service/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/46191388892/in/dateposted-public/" title="Screen Shot 2018-12-08 at 10.36.20 PM"><img src="https://i1.wp.com/farm2.staticflickr.com/1956/46191388892_1446150027_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-12-08 at 10.36.20 PM" data-recalc-dims="1" /></a>

<a href="https://github.com/drone/drone">Drone</a> 在上個月宣布推出 <a href="https://blog.drone.io/drone-cloud/">Cloud 服務</a> 整合 <a href="https://github.com">GitHub</a> 帳戶內的 Repo，只要登入後就可以跑 GitHub 上面的專案自動化整合及測試，原先在 GitHub 上面常見的就是 <a href="https://travis-ci.org/">Travis</a> 或 <a href="https://circleci.com/">CircleCI</a>，現在 Drone 也正式加入角逐行列，但是從文中內可以看到其實是由 <a href="http://packet.net/">Packet</a> 這間公司獨家贊助硬體及網路給 Drone，兩台實體機器，一台可以跑 X86 另外一台可以跑 ARM，也就是如果有在玩 ARM 開發版，現在可以直接在 Drone Cloud 上面直接跑測試。底下是硬體規格:

<span id="more-7132"></span>

<a href="https://www.flickr.com/photos/appleboy/46191481952/in/dateposted-public/" title="Screen Shot 2018-12-09 at 7.16.54 PM"><img src="https://i1.wp.com/farm5.staticflickr.com/4881/46191481952_eafbd244a2_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-12-09 at 7.16.54 PM" data-recalc-dims="1" /></a>

最後大家一定會問 Drone 有支援 Matrix Builds 嗎？答案就是有的，也就是專案可以同時測試多版本的語言，或多版本的資料庫，甚至同時測試 X86 及 ARM 系統，這些功能在 Drone 都是有支援的。詳細設定方式可以參考『<a href="https://docs.drone.io/config/pipeline/multi-platform/">Multi-Platform Pipelines</a>』。

<h2>影片介紹</h2>

Drone Cloud 的簡介可以參考底下影片

<iframe width="560" height="315" src="https://www.youtube.com/embed/Fh4yQhzXsWA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Drone 新版 UI 介紹可以看底下影片:

<iframe width="560" height="315" src="https://www.youtube.com/embed/OlucMSF1Xss" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7113" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/drone-ci-cd-platform-in-mopconf/" class="wp_rp_title">高雄 Mopcon 濁水溪以南最大研討會 &#8211; Drone CI/CD 介紹</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7006" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/" class="wp_rp_title">[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7115" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/drone-release-1-0-0-rc1/" class="wp_rp_title">開源專案 Drone 推出 1.0.0 RC1 版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-6782" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/drone-release-0-8-0-rc-1/" class="wp_rp_title">Drone 發佈 0.8.0-rc.1 版本</a><small class="wp_rp_comments_count"> (17)</small><br /></li><li data-position="8" data-poid="in-7056" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/drone-with-hashicorp-packer/" class="wp_rp_title">用 Drone CI/CD 整合 Packer 自動產生 GCP 或 AWS 映像檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6904" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/drone-secret-security/" class="wp_rp_title">Drone Secret 安全性管理</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>