---
title: "10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務"
date: 2019-03-22
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/HIVQn1cNncIZ8EdJ7P-Nc9ohmuoSgGfnhB0Nfjl3fxsSoZ_RUBrz0yPB73EQy2Plc5NB1919QKsU7gwioFV0A9f-kD46qFovSkeJBO64iKPnTxZ860YGjdhRDMxseJ67OjSVSsEoskY=w2400"><img src="https://lh3.googleusercontent.com/HIVQn1cNncIZ8EdJ7P-Nc9ohmuoSgGfnhB0Nfjl3fxsSoZ_RUBrz0yPB73EQy2Plc5NB1919QKsU7gwioFV0A9f-kD46qFovSkeJBO64iKPnTxZ860YGjdhRDMxseJ67OjSVSsEoskY=w2400" alt="" /></a></p>
<p>這標題也許有點誇張，但是如果實際操作一次，肯定可以在 10 分鐘內操作完成。本篇來教大家如何用 <a href="https://traefik.io/">Traefik</a> 當作前端 Proxy，後端搭配 <a href="https://github.com/drone/drone">Drone</a> 服務接 <a href="https://github.com">GitHub</a>，為什麼會用 Traefik，原因很簡單，你可以把 Traefik 角色想成是 <a href="https://www.nginx.com/">Nginx</a>，但是又比 Nginx 更簡單設定，另外一點就是，Traefik 自動整合了 <a href="https://letsencrypt.org/">Let&#8217;s Encrypt</a> 服務，您就不用擔心憑證會過期的問題。假如機器只會有一個 Drone 當 Host 的話，其實也可以不使用 Traefik，因為 Drone 其實也是內建自動更新憑證的功能。如果您對 Traefik 有興趣，可以直接參考底下兩篇文章</p>
<ul>
<li><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/">用 Traefik 搭配 Docker 快速架設服務</a> (內附教學影片)</li>
<li><a href="https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/">Traefik 搭配 Docker 自動更新 Let’s Encrypt 憑證</a> (內附教學影片)</li>
</ul>
<span id="more-7298"></span>
<h2>教學影片</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/a6tbQFajX28" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ul>
<li>00:37 架設 Traefik 服務 Listen 80 及 443 port</li>
<li>02:42 用 Docker 架設 Drone 並且透過 Label 跟 Traefik 串接</li>
<li>04:11 在 GitHub 申請 App Client ID 及 Secret</li>
</ul>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a>                                                                                                                     </li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>設定單一 Drone 服務</h2>
<p>為什麼說是單一 Drone 服務呢，原因是在 Drone 1.0 開始支援在單一容器內就可以跑 server 跟 agent 同時啟動，降低大家入門門檻，本篇就是以單一容器來介紹，當然如果團隊比較大，建議還是把 server 跟 agent 拆開會比較適合。先建立 <code>docker-compose.yml</code>，相關代碼都可以在這邊<a href="https://github.com/go-training/drone-tutorial">找到</a>。</p>
<pre><code class="language-yaml">version: '2'

services:
  drone-server:
    image: drone/drone:1.0.0
    volumes:
      - ./:/data
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
    environment:
      - DRONE_SERVER_HOST=${DRONE_SERVER_HOST}
      - DRONE_SERVER_PROTO=${DRONE_SERVER_PROTO}
      - DRONE_TLS_AUTOCERT=false
      - DRONE_RUNNER_CAPACITY=3
      # GitHub Config
      - DRONE_GITHUB_SERVER=https://github.com
      - DRONE_GITHUB_CLIENT_ID=${DRONE_GITHUB_CLIENT_ID}
      - DRONE_GITHUB_CLIENT_SECRET=${DRONE_GITHUB_CLIENT_SECRET}
      - DRONE_LOGS_PRETTY=true
      - DRONE_LOGS_COLOR=true
    networks:
      - web
    logging:
      options:
        max-size: "100k"
        max-file: "3"
    labels:
      - "traefik.docker.network=web"
      - "traefik.enable=true"
      - "traefik.basic.frontend.rule=Host:${DRONE_SERVER_HOST}"
      - "traefik.basic.port=80"
      - "traefik.basic.protocol=http"

networks:
  web:
    external: true</code></pre>
<p>接著建立 <code>.env</code>，並且寫入底下資料</p>
<pre><code class="language-sh">DRONE_SERVER_HOST=
DRONE_SERVER_PROTO=
DRONE_GITHUB_CLIENT_ID=
DRONE_GITHUB_CLIENT_SECRET=</code></pre>
<p>其中 proto 預設是跑 http，這邊不用動，traefik 會自動接上 container port，drone 預設跑在 80 port，這邊跟前一版的 drone 有些差異，請在 <code>traefik.basic.port</code> 設定 <code>80</code> 喔，接著跑 <code>docker-compose up</code></p>
<pre><code class="language-sh">$ docker-compose up
drone-server_1  | {
drone-server_1  |   "acme": false,
drone-server_1  |   "host": "drone.ggz.tw",
drone-server_1  |   "level": "info",
drone-server_1  |   "msg": "starting the http server",
drone-server_1  |   "port": ":80",
drone-server_1  |   "proto": "http",
drone-server_1  |   "time": "2019-03-21T17:13:32Z",
drone-server_1  |   "url": "http://drone.ggz.tw"
drone-server_1  | }</code></pre>
<p>如果看到上面的訊息，代表已經架設完成。先假設各位已經都先安裝好 traefik，透過 docker label，traefik 會自動將流量 proxy 到對應的 container。</p>
<h2>心得</h2>
<p>這是我玩過最簡單的 CI/CD 開源專案，設定相當容易，作者花了很多心思在這上面。另外我會在四月北上參加『<a href="https://battle.devopstw.club/">CI / CD 大亂鬥</a>』擔任 Drone 的代表，希望可以在現場多認識一些朋友，如果對 Drone 有任何疑問，隨時歡迎找我，或直接到現場交流。</p>
<div class="wp_rp_wrap  wp_rp_plain" id="wp_rp_first"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="1" data-poid="in-7217" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/" class="wp_rp_title">Traefik 搭配 Docker 自動更新 Let&#8217;s Encrypt 憑證</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="2" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="6" data-poid="in-6762" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/laravel-conf-in-taipei/" class="wp_rp_title">台灣第一屆 Laravel 研討會</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="7" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="8" data-poid="in-6745" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/trigger-gitlab-ci-or-jenkins-using-drone/" class="wp_rp_title">Drone 自動觸發 GitLab CI 或 Jenkins 任務</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="9" data-poid="in-7137" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/docker-testing-with-flutter-sdk/" class="wp_rp_title">用 Docker 整合測試 Flutter 框架</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>