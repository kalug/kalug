---
title: "用 Drone 自動化上傳 Docker Image 到 GitHub Docker Registry"
date: 2019-09-07
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/09/upload-docker-image-to-github-registry-using-drone/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/tR9wbUwpzzbEUnDDsZlo0jnL1AaTZRLo-T4D7Dz-PE5mN9cj6vQ94bJVzoOdUPlZtJEjxkxJvCe5WFgzKyclj94HBZdo9FMCnY5_b98ZG88pGN5v9A6jLSbY-dnz2oetLiuSi1pYI7E=w1920-h1080" title="github"><img src="https://lh3.googleusercontent.com/tR9wbUwpzzbEUnDDsZlo0jnL1AaTZRLo-T4D7Dz-PE5mN9cj6vQ94bJVzoOdUPlZtJEjxkxJvCe5WFgzKyclj94HBZdo9FMCnY5_b98ZG88pGN5v9A6jLSbY-dnz2oetLiuSi1pYI7E=w1920-h1080" alt="github" title="github" /></a></p>
<p>很高興收到 <a href="https://github.com">GitHub</a> 的 Beta 邀請函來開始試用 <a href="https://help.github.com/en/articles/about-github-package-registry">GitHub Package Registry</a> 相關功能，從說明文件可以知道目前 Registry 支援了好幾種 Package 像是 <a href="https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry/">npm</a>, <a href="https://help.github.com/en/articles/configuring-rubygems-for-use-with-github-package-registry/">gem</a>, <a href="https://help.github.com/en/articles/configuring-docker-for-use-with-github-package-registry/">docker</a>, <a href="https://help.github.com/en/articles/configuring-apache-maven-for-use-with-github-package-registry/">mvn</a> 及 <a href="https://help.github.com/en/articles/configuring-nuget-for-use-with-github-package-registry/">nuget</a>，這篇主要跟大家介紹如何用 Drone 快速串接 CI/CD 流程的『自動上傳 Docker Image 到 GitHub Registry』，底下來看看如何使用 GitHub 提供的 Docker Registry。</p>
<span id="more-7458"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/2MgV6NKeeJU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>GitHub 認證</h2>
<pre><code class="language-bash">$ docker login docker.pkg.github.com \
  -u USERNAME \
  -p PASSWORD/TOKEN</code></pre>
<p>要登入 GitHub 的 Docker Registry，最快的方式就是用個人的帳號及密碼就可以直接登入，而 Registry 設定則是 <code>docker.pkg.github.com</code>，這邊請注意，雖然官方有寫可以用個人的 Password 登入，如果你有使用 OTP 方式登入，這個方式就不適用，也不安全，我個人強烈建議去後台建立一把專屬的 Token。</p>
<p><a href="https://lh3.googleusercontent.com/wLdNdGGODCbl1RKxsIg4SANzxrivIIH-IJA2zKd4FfWhtFRoVykQD4qs0GbxbOrZJuKooRhmI6R8WM0r41rDo0Asv7NdObXfGorcORR7YhYPlko91P22kXHgIMlRL1-WdnOkxtGxOo0=w1920-h1080" title="Personal Token"><img src="https://lh3.googleusercontent.com/wLdNdGGODCbl1RKxsIg4SANzxrivIIH-IJA2zKd4FfWhtFRoVykQD4qs0GbxbOrZJuKooRhmI6R8WM0r41rDo0Asv7NdObXfGorcORR7YhYPlko91P22kXHgIMlRL1-WdnOkxtGxOo0=w1920-h1080" alt="Personal Token" title="Personal Token" /></a></p>
<p>其中 <code>read:packages</code> and <code>write:packages</code> 兩個 scope 請務必勾選，如果是 private 的 repo，再把 <code>repo</code> 選項打勾，這樣就可以拿到一把 token 當作是密碼，你可以透過 <code>docker login</code> 來登入試試看</p>
<h2>串接 Drone CI/CD</h2>
<p>從 commit 到自動化上傳 Docker Image 可以透過 Drone 快速完成，底下我們先建立 <code>Dockerfile</code></p>
<pre><code class="language-dockerfile">FROM plugins/base:multiarch

LABEL maintainer=&quot;Bo-Yi Wu &lt;appleboy.tw@gmail.com&gt;&quot; \
  org.label-schema.name=&quot;Drone Workshop&quot; \
  org.label-schema.vendor=&quot;Bo-Yi Wu&quot; \
  org.label-schema.schema-version=&quot;1.0&quot;

ADD release/linux/amd64/helloworld /bin/

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ &quot;/bin/helloworld&quot;, &quot;-ping&quot; ]

ENTRYPOINT [&quot;/bin/helloworld&quot;]</code></pre>
<p>接著透過 Drone 官方 <a href="http://plugins.drone.io/drone-plugins/drone-docker/">docker</a> 套件來完成自動化上傳</p>
<pre><code class="language-yaml">kind: pipeline
name: default

steps:
- name: build
  image: golang:1.13
  commands:
  - make build_linux_amd64

- name: docker
  image: plugins/docker
  settings:
    registry: docker.pkg.github.com
    repo: docker.pkg.github.com/appleboy/test/demo
    auto_tag: true
    auto_tag_suffix: linux-amd64
    username: appleboy
    password:
      from_secret: docker_password</code></pre>
<p>比較需要注意的是 GitHub 跟 DockerHub 不同的是，GitHub 格式是 <code>OWNER/REPOSITORY/IMAGE_NAME</code>，注意中間有多一個 <code>REPOSITORY</code> 而 DockerHub 是 <code>OWNER/IMAGE_NAME</code>。接著到後台將 <code>docker_password</code> 設定完成，就可以正確部署了。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7474" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/ansible-setup-google-container-registry-and-upload-image-via-drone-ci-cd/" class="wp_rp_title">Ansible 設定 Google Container Registry 搭配 Drone 自動上傳</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="2" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-7226" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/converts-a-jsonnet-configuration-file-to-a-yaml-in-drone/" class="wp_rp_title">有效率的用 jsonnet 撰寫  Drone CI/CD 設定檔</a><small class="wp_rp_comments_count"> (12)</small><br /></li><li data-position="8" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7446" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/" class="wp_rp_title">用 10 分鐘安裝好 Drone 搭配 GitLab</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>