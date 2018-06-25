---
title: "[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務"
date: 2018-04-15
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/34957940160/in/dateposted-public/" title="drone-logo_512"><img src="https://i1.wp.com/c1.staticflickr.com/5/4236/34957940160_435d83114f_z.jpg?w=840&#038;ssl=1" alt="drone-logo_512" data-recalc-dims="1" /></a>

<a href="https://drone.io">Drone</a> 是一套用 <a href="https://golang.org">Go 語言</a>撰寫的 CI/CD <a href="https://github.com/drone/drone">開源專案</a>，是由一個 Server 跟多個 Agent 所組成，Agent 上面必須安裝好 <a href="https://www.docker.com">Dokcer</a> 才可以順利測試及部署，但是團隊內會出現一個狀況，每個專案的測試及部署方式不同，有的測試需要 Agent 很多 CPU 或記憶體資源，有的小專案則不需要那麼多，但是當大專案把 agent 系統資源吃光，其他專案都跑不動了，這邊的解決方式就是再建立一台新的 Agent 服務，將需要大量資源的專案跑在該台新的 Agent，Drone 這邊有支援 <code>filter</code> 功能，讓開發者可以指定專案要跑在哪一台 Agent 上。底下來教大家如何設定 drone filter。

<span id="more-7006"></span>

<h2>新增 DRONE_FILTER 設定</h2>

打開 <code>docker-compose.yml</code>，找到 Drone agent 的設定，加入底下變數:

<pre class="brush: plain; title: ; notranslate">
DRONE_FILTER=&quot;ram &lt;= 16 AND cpu &lt;= 8&quot;
</pre>

這邊的意思是，專案需要的記憶體<code>小於或等於 16</code>，CPU <code>小於或等於 8</code>。

<h2>新增 Labels 在 .drone.yml</h2>

這邊要介紹 <code>Labels</code>，可以用來指定該專案要標記上哪些 Label，讓 drone server 可以根據這些 Label 來將 Job 丟到指定的 Agent 服務內。請打開 <code>.drone.yml</code>，加入底下設定

<pre class="brush: plain; title: ; notranslate">
labels:
  - ram=14
  - cpu=8
</pre>

可以看到上面設定 ram = 14 及 cpu = 8 可以看到符合上面 drone agent 的 filter 條件設定，所以 server 會將此 project 的工作都指定到特定的 agent 服務上，這樣就可以避免大專案跟小專案同時跑在同一台機器上。

<h2>教學影片</h2>

如果上述步驟不知道該如何操作，可以參考底下教學影片

<iframe width="560" height="315" src="https://www.youtube.com/embed/OM_L_qE1Pus" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<h2>結論</h2>

為了能讓團隊繼續成長，就必須要一直擴展 Agent。原先在公司內部建立一台 server 加上多台 Agent，而各團隊維護各自的 Agent 服務，團隊間不共享 Angent 資源，這樣避免各專案互相卡住。透過 drone filter 可以讓團隊管理各自的專案在自己的 agent 服務上。如果您對 Drone 有興趣，也可以參考 Udemy 上面的『<a href="https://www.udemy.com/devops-oneday/?couponCode=DRONE-DEVOPS">一天學會 DevOps 自動化測試及部署</a>』線上課程。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6804" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/why-i-choose-drone-as-ci-cd-tool/" class="wp_rp_title">為什麼我用 Drone 取代 Jenkins 及 GitLab CI</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="2" data-poid="in-6507" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/09/drone-ci-server-integrate-atlassian-bitbucket-server/" class="wp_rp_title">Drone CI Server 搭配 Atlassian Bitbucket Server (前身 Stash)</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-6786" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/2017-coscup-introduction-to-gitea-drone/" class="wp_rp_title">2017 COSCUP 研討會: Gitea + Drone 介紹</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="4" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="5" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-6925" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/12/drone-cli-local-testing/" class="wp_rp_title">在本機端導入 Drone CLI 做專案測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6904" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/drone-secret-security/" class="wp_rp_title">Drone Secret 安全性管理</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>