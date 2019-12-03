---
title: "[Drone] 將單一 Job 分配到多台機器，降低部署執行時間"
date: 2019-08-05
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/08/drone-multiple-machine/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/q2Z5tLXdw_GINCveZ4860CTUhfnJtrhdSuWt4VItXWggiPnKqc0sI_0lvxz4lfB4v-MoCPNW50H16QwzQUzOwuIfgug6fvwemQme0Km9c9UeEdCYL2cZzHuK7lhZ4lMClDZ07CBVLiM=w1920-h1080" title="drone multiple machine"><img src="https://lh3.googleusercontent.com/q2Z5tLXdw_GINCveZ4860CTUhfnJtrhdSuWt4VItXWggiPnKqc0sI_0lvxz4lfB4v-MoCPNW50H16QwzQUzOwuIfgug6fvwemQme0Km9c9UeEdCYL2cZzHuK7lhZ4lMClDZ07CBVLiM=w1920-h1080" alt="drone multiple machine" title="drone multiple machine" /></a></p>
<p>在傳統 CI/CD 流程，都是會在同一台機器上進行，所以當有一個 Job 吃了很大的資源時，其他工作都必須等待該 Job 執行完畢，釋放出資源後，才可以繼續進行。現在 Drone 推出一個新功能，叫做 <a href="https://docs.drone.io/user-guide/pipeline/multi-machine/">Multiple Machine</a> 機制，現在開發者可以將同一個 Job 內，拆成很多步驟，將不同的步驟丟到不同機器上面去執行，降低部署執行時間，假設現在有兩台機器 A 及 B，你可以將前端的測試丟到 A 機器，後端的測試，丟到 B 機器，來達到平行處理，並且享受兩台機器的資源，在沒有這機制之前，只能在單一機器上面跑平行處理，沒有享受到多台機器的好處。</p>
<span id="more-7430"></span>
<h2>影片介紹</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/IRf9yyaHQ5I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>實際範例</h2>
<p>底下來看看如何將前端及後端的工作拆成兩台機器去跑:</p>
<pre><code class="language-yaml">kind: pipeline
name: frontend

steps:
- name: build
  image: node
  commands:
  - npm install
  - npm test

---
kind: pipeline
name: backend

steps:
- name: build
  image: golang
  commands:
  - go build
  - go test

services:
- name: redis
  image: redis</code></pre>
<p>簡單設定兩個不同的 pipeline，就可以將兩條 pipeline 流程丟到不同機器上面執行。上述平行執行後，可以透過 <code>depends_on</code> 來等到上述兩個流程跑完，再執行。</p>
<pre><code class="language-yaml">---
kind: pipeline
name: after

steps:
- name: notify
  image: plugins/slack
  settings:
    room: general
    webhook: https://...

depends_on:
- frontend
- backend</code></pre>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7426" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/07/trigger-the-drone-job-via-promotion/" class="wp_rp_title">透過 Drone CLI 手動觸發 CI/CD 流程</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7409" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/06/install-drone-ci-cd-using-ansible/" class="wp_rp_title">用 Ansible 安裝 Drone CI/CD 開源專案</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7226" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/converts-a-jsonnet-configuration-file-to-a-yaml-in-drone/" class="wp_rp_title">有效率的用 jsonnet 撰寫  Drone CI/CD 設定檔</a><small class="wp_rp_comments_count"> (12)</small><br /></li><li data-position="3" data-poid="in-7474" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/ansible-setup-google-container-registry-and-upload-image-via-drone-ci-cd/" class="wp_rp_title">Ansible 設定 Google Container Registry 搭配 Drone 自動上傳</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7280" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/" class="wp_rp_title">開源專案 Gitea 支援 OAuth Provider</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="6" data-poid="in-7458" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/09/upload-docker-image-to-github-registry-using-drone/" class="wp_rp_title">用 Drone 自動化上傳 Docker Image 到 GitHub Docker Registry</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="9" data-poid="in-7446" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/" class="wp_rp_title">用 10 分鐘安裝好 Drone 搭配 GitLab</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>