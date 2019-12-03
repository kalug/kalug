---
title: "透過 Drone CLI 手動觸發 CI/CD 流程"
date: 2019-07-30
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/07/trigger-the-drone-job-via-promotion/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/72xMoCcL6pClsS5eH08zTP2ksHlV2XaRVhtSDuyYnZ-nDBtXR5dxVyGp6WIE-RJ48WL4ZEwTyAijcmua7ade_GGzJ6yDfcolY2h4ejUGASUjWoDXHQ1okvElcJY7tpf7bxnVc3rrZ7Y=w1920-h1080" title="drone promotion"><img src="https://lh3.googleusercontent.com/72xMoCcL6pClsS5eH08zTP2ksHlV2XaRVhtSDuyYnZ-nDBtXR5dxVyGp6WIE-RJ48WL4ZEwTyAijcmua7ade_GGzJ6yDfcolY2h4ejUGASUjWoDXHQ1okvElcJY7tpf7bxnVc3rrZ7Y=w1920-h1080" alt="drone promotion" title="drone promotion" /></a></p>
<p>相信大家對於 <a href="https://cloud.drone.io/">Drone</a> 並不陌生，這次來介紹 Drone 1.0 的新功能 (更多的 1.0 功能會陸續介紹，也可以參考<a href="https://blog.wu-boy.com/2019/04/cicd-drone-1-0-feature/">之前的文章</a>)，叫做 promotion，為什麼作者會推出這功能呢？大家在團隊工作時，有些步驟真的無法導入 CI/CD 自動化流程，而是需要人工介入後，再做後續處理？相信一定會遇到此狀況，PM 或老闆看過沒問題後，才需要手動觸發流程，在此功能以前，都會麻煩工程師幫忙做後續自動化流程，但是有了 <a href="https://docs.drone.io/user-guide/pipeline/promotion/">promotion</a>，現在連 PM 都可以透過 Drone CLI 來自己做部署啦，這邊就是介紹給大家，如何透過 <a href="https://github.com/drone/drone-cli">Drone CLI</a> 指令來觸發已存在的工作項目。</p>
<span id="more-7426"></span>
<h1>影片教學</h1>
<iframe width="560" height="315" src="https://www.youtube.com/embed/4FnxAJLKaug" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h2>如何使用</h2>
<p>首先你必須要先安裝好 Drone CLI，安裝方式可以直接參考<a href="https://docs.drone.io/cli/install/">官方教學</a>即可，透過底下例子來了解怎麼使用 promotion</p>
<pre><code class="language-yaml">kind: pipeline
name: testing

steps:
- name: stage
  image: golang
  commands:
  - echo &quot;stage&quot;
  when:
    event: [ promote ]
    target: [ staging ]

- name: production
  image: golang
  commands:
  - echo &quot;production&quot;
  when:
    event: [ promote ]
    target: [ production ]

- name: testing
  image: golang
  commands:
  - echo &quot;testing&quot;
  when:
    event: [ promote ]
    target: [ testing ]</code></pre>
<p>上面可以看到，在 when 的條件子句內，可以設定 event 為 <code>promote</code>，接著 target 可以設定為任意名稱，只要是  <code>promote</code> 的 event type，在透過 git commit 預設都不會啟動的，只能透過 drone CLI 方式才可以觸發，那該如何執行命令呢？請看底下</p>
<pre><code class="language-sh">drone build promote &lt;repo&gt; &lt;build&gt; &lt;environment&gt;</code></pre>
<p>其中 <code>build</code> 就是直接在後台列表上找一個已經執行過的 job ID</p>
<pre><code class="language-sh">drone build promote appleboy/golang-example 6 production</code></pre>
<h2>心得</h2>
<p>Drone 提供手動觸發的方式相當方便，畢竟有些情境真的是需要人工審核確認過後，才可以進行後續的流程，透過此方式，也可以寫一些 routine 的 job 讓其他開發者，甚至 PM 可以透過自己的電腦觸發流程。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7430" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/drone-multiple-machine/" class="wp_rp_title">[Drone] 將單一 Job 分配到多台機器，降低部署執行時間</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7409" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/06/install-drone-ci-cd-using-ansible/" class="wp_rp_title">用 Ansible 安裝 Drone CI/CD 開源專案</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7226" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/converts-a-jsonnet-configuration-file-to-a-yaml-in-drone/" class="wp_rp_title">有效率的用 jsonnet 撰寫  Drone CI/CD 設定檔</a><small class="wp_rp_comments_count"> (12)</small><br /></li><li data-position="3" data-poid="in-6925" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/12/drone-cli-local-testing/" class="wp_rp_title">在本機端導入 Drone CLI 做專案測試</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-7280" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/" class="wp_rp_title">開源專案 Gitea 支援 OAuth Provider</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="6" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="7" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7446" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/" class="wp_rp_title">用 10 分鐘安裝好 Drone 搭配 GitLab</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7528" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/10/auto-cancellation-in-drone-ci-cd/" class="wp_rp_title">Drone CI/CD 支援 Auto cancellation 機制</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>