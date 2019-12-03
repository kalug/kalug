---
title: "在 Docker 內設定使用者及群組權限的三種方式"
date: 2019-10-10
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/10/three-ways-to-setup-docker-user-and-group/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/CDrKX9nVEAkUnrVNX26Mf0HY1iW73gM6z8WCITgo5QUWx3yXZPOzAI6op59p-YxKYgPkBQalH-rWUb2gElpc2gwjZ3M5jgKeHQ4MI88DkMXjxzkAhQX-zgIqjbGpRrlV38uXLFDxcMU=w1920-h1080" title="docker"><img src="https://lh3.googleusercontent.com/CDrKX9nVEAkUnrVNX26Mf0HY1iW73gM6z8WCITgo5QUWx3yXZPOzAI6op59p-YxKYgPkBQalH-rWUb2gElpc2gwjZ3M5jgKeHQ4MI88DkMXjxzkAhQX-zgIqjbGpRrlV38uXLFDxcMU=w1920-h1080" alt="docker" title="docker" /></a></p>
<p>如果平常本身有在玩 <a href="https://www.docker.com/">Docker</a> 的開發者肯定知道透過 docker command 啟動的容器預設是使用 <code>root</code> 來當作預設使用者及群組，這邊會遇到一個問題，當 Host 環境你有 root 權限就沒有此問題，如果你沒有 root 權限，又有需求在 Docker 容器內掛上 Volume，會發現產生出來的檔案皆會是 root 權限，這時候在 Host 完全無法寫入。本篇教大家使用三種方式來設定容器使用者權限。</p>
<span id="more-7481"></span>
<h2>使用 docker 指令時指定使用者</h2>
<p>進入 Ubuntu 容器會透過底下指令:</p>
<pre><code class="language-bash">docker run -ti ubuntu /bin/bash</code></pre>
<p>這時候可以透過 <code>-u</code> 方式將使用者 uid 及群組 gid 傳入容器內。</p>
<pre><code class="language-bash">mkdir tmp
docker run -ti -v $PWD/tmp:/test \
  -u uid:gid ubuntu /bin/bash</code></pre>
<p>如何找到目前使用者 uid 及 gid 呢，可以透過底下方式</p>
<pre><code class="language-bash">id -u
id -g</code></pre>
<p>上述指令可以改成:</p>
<pre><code class="language-bash">docker run -ti -v $PWD/tmp:/test \
  -u $(id -u):$(id -g) ubuntu /bin/bash</code></pre>
<h2>使用 Dockerfile 指定使用者</h2>
<p>也可以直接在 <a href="https://docs.docker.com/engine/reference/builder/">dockerfile</a> 內直接指定使用者:</p>
<pre><code class="language-bash"># Dockerfile

USER 1000:1000</code></pre>
<p>我個人不是很推薦這方式，除非是在 container 內獨立建立使用者，並且指定權限。</p>
<h2>透過 docker-compose 指定權限</h2>
<p>透過 <a href="https://docs.docker.com/compose/">docker-compose</a> 可以一次啟動多個服務。用 <code>user</code> 可以指定使用者權限來寫入特定的 volume</p>
<pre><code class="language-yaml">services:
  agent:
    image: xxxxxxxx
    restart: always
    networks:
      - proxy
    logging:
      options:
        max-size: &quot;100k&quot;
        max-file: &quot;3&quot;
    volumes:
      - ${STORAGE_PATH}:/data
    user: ${CURRENT_UID}</code></pre>
<p>接著可以透過 <code>.env</code> 來指定變數值</p>
<pre><code class="language-bash">STORAGE_PATH=/home/deploy/xxxx
CURRENT_UID=1001:1001</code></pre>
<h2>心得</h2>
<p>會指定使用者權限通常都是有掛載 Host volume 進入容器內，但是您又沒有 root 權限，如果沒有這樣做，這樣產生出來的檔案都會是 root 權限，一般使用者無法寫入，只能讀取，這時就需要用到此方法。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7137" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/docker-testing-with-flutter-sdk/" class="wp_rp_title">用 Docker 整合測試 Flutter 框架</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6191" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/03/docker-commands-and-best-practices-cheat-sheet/" class="wp_rp_title">Docker 實用指令及 Best Practices Cheat Sheet 圖表</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-6054" data-post-type="none" ><a href="https://blog.wu-boy.com/2015/12/docker-images-network-timed-out/" class="wp_rp_title">Docker 下載 Images 遇到 Network timed out</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7217" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/" class="wp_rp_title">Traefik 搭配 Docker 自動更新 Let&#8217;s Encrypt 憑證</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="4" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="6" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-6467" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/07/upgrade-docker-and-docker-compose-on-travis/" class="wp_rp_title">在 Travis 升級 Docker 和 docker-compose 版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-7458" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/09/upload-docker-image-to-github-registry-using-drone/" class="wp_rp_title">用 Drone 自動化上傳 Docker Image 到 GitHub Docker Registry</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>