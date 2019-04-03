---
title: "在 docker-in-docker 環境中使用 cache-from 提升編譯速度"
date: 2019-02-24
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/NxYD5o3PrenPHddPaNvv8EMK6u-cUdx5KnmmdYMXpxLzD9oDcTAchd0q4GRJxsOLJkeAhhVxzDmcJoWIzHqyo6hTV1FYZXzUbQ-elJNzlqKTYcBJcAOhkansgWHPTleQGOz92xwv_zE=w1920-h1080" title="提升 docker build 時間"><img src="https://lh3.googleusercontent.com/NxYD5o3PrenPHddPaNvv8EMK6u-cUdx5KnmmdYMXpxLzD9oDcTAchd0q4GRJxsOLJkeAhhVxzDmcJoWIzHqyo6hTV1FYZXzUbQ-elJNzlqKTYcBJcAOhkansgWHPTleQGOz92xwv_zE=w1920-h1080" alt="提升 docker build 時間" title="提升 docker build 時間" /></a></p>
<p>在現代 CI/CD 的環境流程中，使用 <a href="https://github.com/jpetazzo/dind">Docker In Docker</a> 來編譯容器已經相當流行了，像是 <a href="https://about.gitlab.com/product/continuous-integration/">GitLab CI</a> 或 <a href="https://github.com/drone/drone" title="Drone">Drone</a> 都是全走 <a href="https://www.docker.com/" title="Docker">Docker</a> 環境，然而有很多人建議盡量不要在 CI 環境使用 Docker In Docker，原因在於 CI 環境無法使用 Host Image 資料，導致每次要上傳 Image 到 <a href="https://hub.docker.com/" title="Docker Hub">Docker Hub</a> 時都需要重新下載所有的 Docker Layer，造成每次跑一次流程都會重複花費不少時間，而這個問題在 <a href="https://github.com/docker/docker/releases/tag/v1.13.0">v1.13</a> 時被解決，現在只要在編譯過程指定一個或者是多個 Image 列表，先把 Layer 下載到 Docker 內，接著對照 Dockerfile 內只要有被 Cache 到就不會重新再執行，講得有點模糊，底下直接拿實際例子來看看。</p>
<span id="more-7263"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Taa6QkStg78" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>歡迎訂閱我的 Youtube 頻道: <a href="http://bit.ly/youtube-boy">http://bit.ly/youtube-boy</a></p>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>使用 &#8211;cache-from 加速編譯</h2>
<p>在 Docker v1.13 版本中新增了 <code>--cache-from</code> 功能讓開發者可以在編譯 Dockerfile 時，同時指定先下載特定的 Docker Image，透過先下載好的 Docker Layer 在跟 Dockerfile 內文比較，如果有重複的就不會在被執行，這樣可以省下蠻多編譯時間，底下拿個簡單例子做說明，假設我們有底下的 Dockerfile</p>
<pre><code class="language-docker">FROM alpine:3.9
LABEL maintainer="maintainers@gitea.io"

EXPOSE 22 3000

RUN apk --no-cache add \
    bash \
    ca-certificates \
    curl \
    gettext \
    git \
    linux-pam \
    openssh \
    s6 \
    sqlite \
    su-exec \
    tzdata

RUN addgroup \
    -S -g 1000 \
    git &amp;&amp; \
  adduser \
    -S -H -D \
    -h /data/git \
    -s /bin/bash \
    -u 1000 \
    -G git \
    git &amp;&amp; \
  echo "git:$(dd if=/dev/urandom bs=24 count=1 status=none | base64)" | chpasswd

ENV USER git
ENV GITEA_CUSTOM /data/gitea

VOLUME ["/data"]

ENTRYPOINT ["/usr/bin/entrypoint"]
CMD ["/bin/s6-svscan", "/etc/s6"]

COPY docker /
COPY --from=build-env /go/src/code.gitea.io/gitea/gitea /app/gitea/gitea
RUN ln -s /app/gitea/gitea /usr/local/bin/gitea</code></pre>
<p>透過底下命令列可以編譯出 Image</p>
<pre><code class="language-sh">$ docker build -t gitea/gitea .</code></pre>
<p>而在命令列內可以看到花最多時間的是底下這個步驟</p>
<pre><code class="language-docker">RUN apk --no-cache add \
    bash \
    ca-certificates \
    curl \
    gettext \
    git \
    linux-pam \
    openssh \
    s6 \
    sqlite \
    su-exec \
    tzdata</code></pre>
<p>該如何透過 <code>--cache-from</code> 機制繞過此步驟加速 Docker 編譯時間，其實很簡單只要在網路上找到原本 image 就可以繞過此步驟，開發者總會知道原本的 Dockerfile 是用來編譯出哪一個 Image 名稱</p>
<pre><code class="language-sh">$ docker build --cache-frome=gitea/gitea -t gitea/gitea .</code></pre>
<p><a href="https://lh3.googleusercontent.com/H_L7tVmjocwOvWEB4DgJsjhPqGyY3IObcl6f0ROl34qfUqDhnIaC9BtI4pN4I7RidYUg_VLw7bRtDdkDEG1eCk6EPdMZ8itjGvWm5aaobn-5oye7j0AsXQCIHIpZUfUW3XGvKCA1a1k=w1920-h1080"><img src="https://lh3.googleusercontent.com/H_L7tVmjocwOvWEB4DgJsjhPqGyY3IObcl6f0ROl34qfUqDhnIaC9BtI4pN4I7RidYUg_VLw7bRtDdkDEG1eCk6EPdMZ8itjGvWm5aaobn-5oye7j0AsXQCIHIpZUfUW3XGvKCA1a1k=w1920-h1080" alt="" /></a></p>
<p>從上圖可以知道時間最久的步驟已經被 cache 下來了，所以 cache-from 會事先把 Image 下載下來，接著就可以使用該 Image 內的 cache layer 享受簡短 build time 的好處。</p>
<h2>在 Gitlab CI 使用 cache-from</h2>
<p>在 Gitlab CI 如何使用，其實很簡單，請<a href="https://gitlab.com/snippets/185782" title="參考此範例">參考此範例</a></p>
<pre><code class="language-yaml">image: docker:latest
services:
  - docker:dind
stages:
  - build
  - test
  - release
variables:
  CONTAINER_IMAGE: registry.anuary.com/$CI_PROJECT_PATH
  DOCKER_DRIVER: overlay2
build:
  stage: build
  script:
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN registry.anuary.com
    - docker pull $CONTAINER_IMAGE:latest
    - docker build --cache-from $CONTAINER_IMAGE:latest --build-arg NPM_TOKEN=${NPM_TOKEN} -t $CONTAINER_IMAGE:$CI_BUILD_REF -t $CONTAINER_IMAGE:latest .
    - docker push $CONTAINER_IMAGE:$CI_BUILD_REF
    - docker push $CONTAINER_IMAGE:latest</code></pre>
<p>這時候你會問時間到底差了多久，在 Node.js 內如果沒有使用 cache，每次 CI 時間至少會多不少時間，取決於開發者安裝多少套件，我會建議如果是使用 multiple stage build 請務必使用 <code>cache-from</code>。</p>
<h2>在 Drone 如何使用 &#8211;cache-from</h2>
<p>在 Drone 1.0 架構內，可以架設多台 <a href="https://docs.drone.io/administration/agents/" title="Agent 服務">Agent 服務</a>加速 CI/CD 流程，但是如果想要跨機器的 storage 非常困難，所以有了 <code>cache-from</code> 後，就可以確保多台 agent 享有 docker cache layer 機制。底下來看看 <a href="https://github.com/drone-plugins/drone-docker" title="plugins/docker">plugins/docker</a> 該如何設定。</p>
<pre><code class="language-yaml">- name: publish
  pull: always
  image: plugins/docker:linux-amd64
  settings:
    auto_tag: true
    auto_tag_suffix: linux-amd64
    cache_from: appleboy/drone-telegram
    daemon_off: false
    dockerfile: docker/Dockerfile.linux.amd64
    password:
      from_secret: docker_password
    repo: appleboy/drone-telegram
    username:
      from_secret: docker_username
  when:
    event:
      exclude:
      - pull_request</code></pre>
<p>這邊拿公司的一個環境當作<a href="https://github.com/Mediatek-Cloud/simulator" title="範例">範例</a>，在還沒使用 cache 前編譯時間為 <a href="https://cloud.drone.io/Mediatek-Cloud/simulator/2/1/2" title="2 分 30 秒">2 分 30 秒</a>，後來使用 <code>cache-from</code> 則變成 <a href="https://cloud.drone.io/Mediatek-Cloud/simulator/6/1/2" title="30 秒">30 秒</a>。</p>
<h2>結論</h2>
<p>使用 <code>--cache-from</code> 需要額外多花下載 Image 檔案的時間，所以開發者需要評估下載 Image 時間跟直接在 Dockerfile 內直接執行的時間差，如果差很多就務必使用 <code>--cache-from</code>。不管是不是應用在 Docker In Docker 內，假如您需要改別人 Dockerfile，請務必先下載對應的 Docker Image 在執行端，這樣可以省去不少 docker build 時間，尤其是在 Dockerfile 內使用到 <code>apt-get instll</code> 或 <code>npm install</code> 這類型的命令。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6745" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/trigger-gitlab-ci-or-jenkins-using-drone/" class="wp_rp_title">Drone 自動觸發 GitLab CI 或 Jenkins 任務</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="1" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6804" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/why-i-choose-drone-as-ci-cd-tool/" class="wp_rp_title">為什麼我用 Drone 取代 Jenkins 及 GitLab CI</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="6" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="8" data-poid="in-7137" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/docker-testing-with-flutter-sdk/" class="wp_rp_title">用 Docker 整合測試 Flutter 框架</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7280" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/" class="wp_rp_title">開源專案 Gitea 支援 OAuth Provider</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>