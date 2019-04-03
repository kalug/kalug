---
title: "用 Docker 整合測試 Flutter 框架"
date: 2018-12-26
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/12/docker-testing-with-flutter-sdk/
layout: post
comments: true
---

<a href='https://photos.google.com/share/AF1QipPVsiQNMhQf-l7rJBe-Ki9RMxMVz0x-xSDpayq967sskqwi2bzqgHBQyc9xaby8eA?key=b0xKVW5oSlEwZEl2b0FESUNDVFRGV2dYbkVPRVVB&#038;source=ctrlq.org'><img src='https://lh3.googleusercontent.com/REguGdEy6qgmZyU7hNscYxXV1lGzSTioUb_cBe4uVLdBNUxL2Y9oNwx2J8w6VU8BMcZhBOJoAI091l9lCJuueumNEef7ub75Dvrbl2ZC1Ri9QholsnccGd6txg9rbXP5oZoNIQVl_Fk=w700' /></a>

<a href="https://flutter.io">Flutter</a> 是一套以 <a href="https://www.dartlang.org/">Dart</a> 語言為主體的手機 App 開發框架，讓開發者可以寫一種語言產生 iOS 及 Android，只要裝好 Flutter 框架，就可以在個人電腦上面同時測試 iOS 及 Android 流程，如果您需要 Docker 環境，可以直接參考<a href="https://github.com/appleboy/flutter-docker">此開源專案</a>，裡面已經將 Flutter 1.0 SDK 包在容器，只要將專案目錄掛載到 Docker 內，就可以透過 <code>flutter test</code> 指令來完成測試，對於 CI/CD 流程使用 Docker 技術非常方便。

<span id="more-7137"></span>

<h2>線上影片教學</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/80kiMR_Firs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<h2>Docker 使用方式</h2>

下載 Docker Image，檔案有點大，先下載好比較方便

<pre class="brush: plain; title: ; notranslate">
$ docker pull appleboy/flutter-docker:1.0.0
</pre>

下載<a href="https://github.com/appleboy/flutter-demo">測試範例</a>，並執行測試

<pre class="brush: plain; title: ; notranslate">
$ git clone https://github.com/appleboy/flutter-demo.git
$ docker run -ti -v ${PWD}/flutter-demo:/flutter-demo -w /flutter-demo \
  appleboy/flutter-docker:1.0.0 \
  /bin/sh -c &quot;flutter test&quot;
</pre>

<h2>使用 Drone 自動化測試</h2>

搭配 <a href="https://cloud.drone.io/">Drone Cloud</a> 服務，在專案底下新增 <a href="https://github.com/appleboy/flutter-demo/blob/4b68b964c5eebde8daf393495e3cc705777aeca3/.drone.yml#L1">.drone.yml</a>，內容如下:

<pre class="brush: plain; title: ; notranslate">
kind: pipeline
name: testing

steps:
  - name: flutter
    image: appleboy/flutter-docker:1.0.0
    commands:
      - flutter test
</pre>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7125" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/flutter-release-1-0-0-version/" class="wp_rp_title">Flutter 推出 1.0 版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="7" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>