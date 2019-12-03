---
title: "Ansible 設定 Google Container Registry 搭配 Drone 自動上傳"
date: 2019-10-03
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/10/ansible-setup-google-container-registry-and-upload-image-via-drone-ci-cd/
layout: post
comments: true
---

<p><img src="https://lh3.googleusercontent.com/mese3VEnyNElOz7iL-z3w0nxM4PcNjC6lfPWxLbPrHTFr3PvKeyxGwIxTXoRztpidxN7gX8WlRtzBsfxkOVb_Pt-jEwCbZtYDD3l0DLeBger7XaC40XVyPUgAyT6yU_FdqJeAUCSQik=w1920-h1080" alt="blog logo" /></p>
<p>最近剛好有需求要串接 <a href="https://cloud.google.com/container-registry/">GCR</a> (Google Container Registry)，專案如果是搭配 GCP 服務，個人建議就直接用 GCR 了。本篇要教大家如何透過 Ansible 管理遠端機器直接登入 GCR，透過特定的帳號可以直接拉 Image，接著用 <a href="https://docs.docker.com/compose/">docker-compose</a> 來重新起動服務，這算是最基本的部署流程，那該如何用 <a href="https://www.ansible.com/">Ansible</a> 登入呢？請看底下教學。</p>
<span id="more-7474"></span>
<h2>使用 ansible docker_login 模組</h2>
<p>Google 提供了<a href="https://cloud.google.com/container-registry/docs/advanced-authentication?hl=zh-tw">好幾種方式</a>來登入 Docker Registry 服務，本篇使用『<a href="https://cloud.google.com/container-registry/docs/advanced-authentication?hl=zh-tw#json_key_file">JSON 金鑰檔案</a>』方式來長期登入專案，開發者會拿到一個 JSON 檔案，在本機電腦可以透過底下指令登入:</p>
<pre><code class="language-bash">cat keyfile.json | docker login \
  -u _json_key \
  --password-stdin \
  https://[HOSTNAME]</code></pre>
<p>如果沒有支援 <code>password-stdin</code> 則可以使用底下:</p>
<pre><code class="language-bash">docker login -u _json_key \
  -p &quot;$(cat keyfile.json)&quot; \
  https://[HOSTNAME]</code></pre>
<p>請注意這邊的使用者帳號統一都是使用 <code>_json_key</code>，而在 Ansible 則是使用 <a href="https://docs.ansible.com/ansible/latest/modules/docker_login_module.html">docker_login</a> 模組</p>
<pre><code class="language-yaml">- name: Log into GCR private registry and force re-authorization
  docker_login:
    registry: &quot;https://asia.gcr.io&quot;
    username: &quot;_json_key&quot;
    password: &quot;{{ lookup(&#039;template&#039;, &#039;gcr.json&#039;, convert_data=False) | string }}&quot;
    config_path: &quot;{{ deploy_home_dir }}/.docker/config.json&quot;
    reauthorize: yes</code></pre>
<p>注意 <code>password</code> 欄位，請將 <code>gcr.json</code> 放置在 <code>role/templates</code> 目錄，透過 lookup 方式並轉成 string 才可以正常登入，網路上有解法說需要在 <code>password</code> 前面加上一個空白才可以登入成功，詳細情況可以<a href="https://stackoverflow.com/questions/57260374/docker-login-to-gce-using-ansible-docker-login-and-json-key">參考這篇</a>。</p>
<h2>使用 Drone 自動化上傳 Image</h2>
<p>講 Drone 之前，我們先來看看 GitLab 怎麼上傳，其實也不難:</p>
<pre><code class="language-yaml">cloudbuild:
  stage: deploy
  image: google/cloud-sdk
  services:
    - docker:dind
  dependencies:
    - build
  script:
    - echo &quot;$GCP_SERVICE_KEY&quot; &gt; gcloud-service-key.json
    - gcloud auth activate-service-account --key-file gcloud-service-key.json
    - gcloud config set project $GCP_PROJECT_ID
    - gcloud builds submit . --config=cloudbuild.yaml --substitutions _IMAGE_NAME=$PROJECT_NAME,_VERSION=$VERSION
  only:
    - release</code></pre>
<p>透過 <a href="https://cloud.google.com/sdk/gcloud/?hl=zh-tw">gcloud</a> 就可以快速自動上傳。而使用 Drone 設定也是很簡單:</p>
<pre><code class="language-yaml">- name: publish
  pull: always
  image: plugins/docker
  settings:
    auto_tag: true
    auto_tag_suffix: linux-amd64
    registry: asia.gcr.io
    cache_from: asia.gcr.io/project_id/image_name
    daemon_off: false
    dockerfile: docker/ponyo/Dockerfile.linux.amd64
    repo: asia.gcr.io/project_id/image_name
    username:
      from_secret: docker_username
    password:
      from_secret: docker_password
  when:
    event:
      exclude:
      - pull_request</code></pre>
<p>其中 <code>password</code> 可以透過後台將 json 資料寫入。這邊有幾個重要功能列給大家參考</p>
<ul>
<li>使用 <code>cache_from</code> 加速</li>
<li>使用 <code>auto_tag</code> 快速部署標籤</li>
</ul>
<p>這兩項分別用在什麼地方，<code>cache_from</code> 可以直接看我之前寫過的一篇『<a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a>』裡面蠻詳細介紹，並且有影片。而 auto_tag 最大的好處是在 release 開源專案 Image，只要你的 tag 有按照標準格式，像是如果是打 <code>v1.0.1</code> 這時候 Drone 會分別產生三個 Image: <code>1</code>, <code>1.0</code>, <code>1.0.1</code>，下次又 release <code>v1.0.2</code>，這時候 <code>1.0</code> 就會指向 <code>1.0.2</code>，類似這樣以此類推，方便其他使用者抓取 Image。這是在其他像是 GitLab 無法做到，應該說不是無法做到，而是變成要自己寫 script 才能做到。</p>
<h2>教學影片</h2>
<p>底下是教您如何使用 docker cache 機制，如果你的 Image 特別大，像是有包含 Linux SDK 之類的，就真的用 cache 會比較快喔。</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Taa6QkStg78" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>歡迎訂閱我的 Youtube 頻道: <a href="http://bit.ly/youtube-boy">http://bit.ly/youtube-boy</a></p>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="1" data-poid="in-6745" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/trigger-gitlab-ci-or-jenkins-using-drone/" class="wp_rp_title">Drone 自動觸發 GitLab CI 或 Jenkins 任務</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="2" data-poid="in-7458" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/09/upload-docker-image-to-github-registry-using-drone/" class="wp_rp_title">用 Drone 自動化上傳 Docker Image 到 GitHub Docker Registry</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7446" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/" class="wp_rp_title">用 10 分鐘安裝好 Drone 搭配 GitLab</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6804" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/why-i-choose-drone-as-ci-cd-tool/" class="wp_rp_title">為什麼我用 Drone 取代 Jenkins 及 GitLab CI</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="9" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>