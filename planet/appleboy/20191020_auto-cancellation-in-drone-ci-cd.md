---
title: "Drone CI/CD 支援 Auto cancellation 機制"
date: 2019-10-20
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/10/auto-cancellation-in-drone-ci-cd/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/RK0neP9RNsD1P5N5zGL0BqgvUFnDDb1YuzyIUKLlD01ejmM87JNaU29bweqw_CyD0v39FYfi5wAh6wCls1CIxaMMiOdHX6WQ4p7hFU5Qlt052uya0NZ6pjJJAA24rfhbpDFDwKmivfU=w1920-h1080"><img src="https://lh3.googleusercontent.com/RK0neP9RNsD1P5N5zGL0BqgvUFnDDb1YuzyIUKLlD01ejmM87JNaU29bweqw_CyD0v39FYfi5wAh6wCls1CIxaMMiOdHX6WQ4p7hFU5Qlt052uya0NZ6pjJJAA24rfhbpDFDwKmivfU=w1920-h1080" alt="" /></a></p>
<p>大家一定會問什麼是『Auto cancellation』呢？中文翻作自動取消，這機制會用在 CI/CD 的哪個流程或步驟呢？我們先來探討一個情境，不知道大家有無遇過在同一個 branch 陸續發了 3 個 commit，會發現在 CI/CD 會依序啟動 3 個 Job 來跑這 3 個 commit，假設您有設定同時間只能跑一個 Job，這樣最早的 commit 會先開始啟動，後面兩個 commit 則會處於 <code>Penging</code> 的狀態，等到第一個 Job 完成後，後面兩個才會繼續執行。</p>
<span id="more-7528"></span>
<p>這邊就會有個問題出現，假設後續團隊又 commit 了 10 個 job，這樣 Pending 狀態則會越來越多，不會越來越少，這時候開發者一定會想，有沒有辦法只保留最新的 Job，而舊有的 Pending Job 系統幫忙取消呢？這個功能在 <a href="https://travis-ci.org/">Travis CI</a> 已經有後台可以啟動，新專案也是預設啟動的，也就是假設現在有一個 job 正在執行，有九個 job 正在 pending 時，新的 job 一進來後，CI/CD 服務就會自動幫忙取消舊有的九個 Job，只保留最新的，確保系統不會浪費時間在跑舊的 Job。Drone 在 1.6 也支持了此功能，底下來看看如何設定 <a href="https://drone.io/" title="Drone">Drone</a> 達到此需求。</p>
<h2>影片教學</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/wV9NH-g7La4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>設定 Drone</h2>
<p>Drone 在 1.6 版才正式支援『Auto cancellation』，而且每個專案預設是不啟動的，需要透過 <a href="https://docs.drone.io/cli/install/" title="Drone CLI">Drone CLI</a> 才能正確啟動。底下來看看如何透過 CLI 啟動：</p>
<pre><code class="language-bash"># 啟用 pull request
drone repo update \
  --auto-cancel-pull-requests=true 
  appleboy/go-hello
# 啟用 push event
drone repo update \
  --auto-cancel-pushes=true \
  appleboy/go-hello</code></pre>
<p>目前還沒有辦法透過後台 UI 介面啟用，請大家使用上述指令來開啟 Auto Cancellation 功能。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="1" data-poid="in-7446" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/" class="wp_rp_title">用 10 分鐘安裝好 Drone 搭配 GitLab</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="4" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7132" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/drone-cloud-service/" class="wp_rp_title">Drone CI/CD 推出 Cloud 服務支援開源專案</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="6" data-poid="in-7006" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/" class="wp_rp_title">[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6526" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/09/docker-cache-on-travis/" class="wp_rp_title">在 Travis 實現 Docker Cache</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>