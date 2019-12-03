---
title: "用 10 分鐘安裝好 Drone 搭配 GitLab"
date: 2019-08-23
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/UBBk430Fl5KSAbDHuu0gyb6VXrjdGM5aj9JV7LqyFbubYDYuUu3KfahdarNJn0SHyEUCN_lWXfhb2BsNxjgD--kFt-MRkDguj1pWRNEpgiTL_zaVn9BDJPmm7wkIFmv0oEm6pt0NHkY=w1920-h1080" title="Drone+GitLab"><img src="https://lh3.googleusercontent.com/UBBk430Fl5KSAbDHuu0gyb6VXrjdGM5aj9JV7LqyFbubYDYuUu3KfahdarNJn0SHyEUCN_lWXfhb2BsNxjgD--kFt-MRkDguj1pWRNEpgiTL_zaVn9BDJPmm7wkIFmv0oEm6pt0NHkY=w1920-h1080" alt="Drone+GitLab" title="Drone+GitLab" /></a></p>
<p>如果你沒在使用 <a href="https://about.gitlab.com/product/continuous-integration/">GitLab CI</a>，那可以來嘗試看看 <a href="https://drone.io/">Drone CI/CD</a>，用不到 10 分鐘就可以快速架設好 Drone，並且上傳一個 <code>.drone.yml</code> 並且開啟第一個部署或測試流程，安裝步驟非常簡單，只需要對 <a href="https://docker.com">Docker</a> 有基本上的了解，通常都可以在短時間完成 Drone CI/CD 架設。</p>
<span id="more-7446"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/FweOIzsa_Yw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>安裝 Drone Server</h2>
<p>用 docker-compose 可以快速設定 Drone Server</p>
<pre><code class="language-yaml">services:
  drone-server:
    image: drone/drone:1
    ports:
      - 8081:80
    volumes:
      - ./:/data
    restart: always
    environment:
      - DRONE_SERVER_HOST=${DRONE_SERVER_HOST}
      - DRONE_SERVER_PROTO=${DRONE_SERVER_PROTO}
      - DRONE_RPC_SECRET=${DRONE_RPC_SECRET}
      - DRONE_AGENTS_ENABLED=true
      # Gitlab Config
      - DRONE_GITLAB_SERVER=https://gitlab.com
      - DRONE_GITLAB_CLIENT_ID=${DRONE_GITLAB_CLIENT_ID}
      - DRONE_GITLAB_CLIENT_SECRET=${DRONE_GITLAB_CLIENT_SECRET}
      - DRONE_LOGS_PRETTY=true
      - DRONE_LOGS_COLOR=true</code></pre>
<p>只要在 <code>docker-compose.yml</code> 底下新增 <code>.env</code> 檔案，將上面的變數值填寫進去即可</p>
<h2>安裝 Drone Agent</h2>
<p>雖然 drone 在 1.0 提供單機版，也就是 server 跟 agent 可以裝在同一台，但是本篇教學還是以分開安裝為主，對未來擴充性會更好。</p>
<pre><code class="language-yaml">  drone-agent:
    image: drone/agent:1
    restart: always
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DRONE_RPC_SERVER=http://drone-server
      - DRONE_RPC_SECRET=${DRONE_RPC_SECRET}
      - DRONE_RUNNER_CAPACITY=3</code></pre>
<p>完整的設定檔可以<a href="https://github.com/go-training/drone-tutorial/blob/7f152ef7074ace3831002dda2217473b2b400b9f/1.x/docker-compose.gitlab.yml#L1">參考這邊</a>。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="1" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-7132" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/drone-cloud-service/" class="wp_rp_title">Drone CI/CD 推出 Cloud 服務支援開源專案</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="3" data-poid="in-7280" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/" class="wp_rp_title">開源專案 Gitea 支援 OAuth Provider</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-7474" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/ansible-setup-google-container-registry-and-upload-image-via-drone-ci-cd/" class="wp_rp_title">Ansible 設定 Google Container Registry 搭配 Drone 自動上傳</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6745" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/trigger-gitlab-ci-or-jenkins-using-drone/" class="wp_rp_title">Drone 自動觸發 GitLab CI 或 Jenkins 任務</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6804" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/why-i-choose-drone-as-ci-cd-tool/" class="wp_rp_title">為什麼我用 Drone 取代 Jenkins 及 GitLab CI</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="8" data-poid="in-7409" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/06/install-drone-ci-cd-using-ansible/" class="wp_rp_title">用 Ansible 安裝 Drone CI/CD 開源專案</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7528" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/auto-cancellation-in-drone-ci-cd/" class="wp_rp_title">Drone CI/CD 支援 Auto cancellation 機制</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>