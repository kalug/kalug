---
title: "用 Ansible 安裝 Drone CI/CD 開源專案"
date: 2019-06-17
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/06/install-drone-ci-cd-using-ansible/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/HZqWLZjp96azorhAZseeSbSj9Q5-dj99lM8cX4ApJjnDL0grXaMEoIHJl3dQEx-ZyFcI713_CeQlPSFMOLgxD19tBOLMmgdQlwMe_QMhwGKrh2pQDWE2bj4cul4ENt21sWRFOYq6agc=w1920-h1080" title="drone and ansible"><img src="https://lh3.googleusercontent.com/HZqWLZjp96azorhAZseeSbSj9Q5-dj99lM8cX4ApJjnDL0grXaMEoIHJl3dQEx-ZyFcI713_CeQlPSFMOLgxD19tBOLMmgdQlwMe_QMhwGKrh2pQDWE2bj4cul4ENt21sWRFOYq6agc=w1920-h1080" alt="drone and ansible" title="drone and ansible" /></a></p>
<p>相信大家對於 <a href="https://github.com/drone/drone">Drone 開源專案</a>並不陌生，如果對於 Drone 不了解的朋友們，可以直接看之前寫的<a href="https://blog.wu-boy.com/?s=drone">系列文章</a>，本篇要教大家如何使用 <a href="https://www.ansible.com/">Ansible</a> 來安裝 Drone CI/CD 開源專案。目前 Drone 可以支援兩種安裝方式: 1. 使用 Docker 2. 使用 binary，如果您是進階開發者，可以使用 binary 方式來安裝，像是在 Debug 就可以透過 build binary 方式來測試。一般來說都是使用 Docker 方式來安裝，在使用 ansible 之前，請先準備一台 Ubuntu 或 Debian 作業系統的 VM 來測試。</p>
<span id="more-7409"></span>
<h2>影片教學</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/GphMs8pfYiA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>更多實戰影片可以參考我的 Udemy 教學系列</p>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone CI/CD 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>事前準備</h2>
<p>首先在您的電腦上安裝 ansible 環境，在 MacOS 很簡單，只需要透過 <code>pip</code> 就可以安裝完成</p>
<pre><code class="language-bash">$ pip install ansible</code></pre>
<p>更多安裝方式，可以直接看<a href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html">官方文件 Installation Guide</a></p>
<h2>Ansible 環境</h2>
<p>來看看 Ansible 專案目錄結構</p>
<pre><code class="language-bash">├── Makefile
├── host.ini
├── playbook.yml
├── roles
│   ├── base
│   └── docker
└── vars
    ├── drone-agent.yml
    └── drone-server.yml</code></pre>
<p>其中 <code>roles</code> 目錄是放置原本專案的角色，本篇內容不會提到，接著我們一一講解每個檔案，首先是 <code>Makefile</code>，裡面其實很簡單，只是兩個 ansible 指令，透過 <code>ansible-lint</code> 可以驗證 playbook 語法是否有錯誤，可以選用。</p>
<pre><code class="language-makefile">all: ansible

lint:
    ansible-lint playbook.yml

ansible: lint
    ansible-playbook -i host.ini playbook.yml</code></pre>
<p>接著定義要在哪一台 VM 上面安裝 drone-server 或 drone-agent，請打開 <code>host.ini</code></p>
<pre><code class="language-yaml">[drone_server]
dog ansible_user=multipass ansible_host=192.168.64.11 ansible_port=22

[drone_agent]
cat ansible_user=multipass ansible_host=192.168.64.11 ansible_port=22</code></pre>
<p>這邊先暫時把 server 跟 agent 裝在同一台，如果要多台 drone-agent，請自行修改。接下來寫 <code>playbook</code></p>
<pre><code class="language-yaml">- name: &quot;deploy drone server.&quot;
  hosts: drone_server
  become: true
  become_user: root
  roles:
    - { role: appleboy.drone }
  vars_files:
    - vars/drone-server.yml

- name: &quot;deploy drone agent.&quot;
  hosts: drone_agent
  become: true
  become_user: root
  roles:
    - { role: appleboy.drone }
  vars_files:
    - vars/drone-agent.yml</code></pre>
<p>可以看到其中 <code>var</code> 目錄底下是放 server 跟 agent 的設定檔案，server 預設是跑 sqlite 資料庫。其中 <code>drone_server_enable</code> 要設定為 <code>true</code>，代表要安裝 drone-server</p>
<pre><code class="language-yaml">drone_server_enable: &quot;true&quot;
drone_version: &quot;latest&quot;
drone_github_client_id: &quot;e2bdde88b88f7ccf873a&quot;
drone_github_client_secret: &quot;b0412c975bbf2b6fcd9b3cf5f19c8165b1c14d0c&quot;
drone_server_host: &quot;368a7a66.ngrok.io&quot;
drone_server_proto: &quot;https&quot;
drone_rpc_secret: &quot;30075d074bfd9e74cfd0b84a5886b986&quot;</code></pre>
<p>接著看 <code>drone-agent.yml</code>，也會看到要安裝 agent 就必須設定 <code>drone_agent_enable</code> 為 <code>true</code>。</p>
<pre><code class="language-yaml">drone_agent_enable: &quot;true&quot;
drone_version: &quot;latest&quot;
drone_rpc_server: &quot;http://192.168.64.2:8081&quot;
drone_rpc_secret: &quot;30075d074bfd9e74cfd0b84a5886b986&quot;</code></pre>
<p>更多變數內容請參考<a href="https://github.com/appleboy/ansible-drone/blob/master/defaults/main.yml">這邊</a>。</p>
<h2>Ansible 套件</h2>
<p>我寫了 <a href="https://github.com/appleboy/ansible-drone">ansible-drone</a> 角色來讓開發者可以快速安裝 drone 服務，安裝方式如下</p>
<pre><code class="language-bash">$ ansible-galaxy install appleboy.drone</code></pre>
<p>上面步驟是安裝 master 版本，如果要指定穩定版本請改成如下 (後面接上 <code>,0.0.2</code> 版號)</p>
<pre><code class="language-bash">$ ansible-galaxy install appleboy.drone,0.0.2</code></pre>
<p>安裝角色後，就可以直接執行了，過程中會將機器先安裝好 Docker 環境，才會接著安裝 server 及 agent。</p>
<pre><code class="language-bash">$ ansible-playbook -i host.ini playbook.yml</code></pre>
<p>以上 Ansible 程式碼可以直接從<a href="https://github.com/go-training/drone-tutorial/tree/b1f215261feb390c4bc02d2c83cb48511b3f76cf/ansible"><strong>這邊下載</strong></a></p>
<h2>心得</h2>
<p>如果有多台機器需要建置，用 Ansible 非常方便。如果是多個 VM 需要快速開啟跟關閉，請透過 <a href="https://www.packer.io/">packer</a> 來建置 Image 來達到快速 auto scale。更多詳細的設定可以參考 <a href="https://github.com/appleboy/ansible-drone">drone role of ansible</a>。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7430" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/drone-multiple-machine/" class="wp_rp_title">[Drone] 將單一 Job 分配到多台機器，降低部署執行時間</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7426" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/07/trigger-the-drone-job-via-promotion/" class="wp_rp_title">透過 Drone CLI 手動觸發 CI/CD 流程</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7446" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/install-drone-with-gitlab-in-10-minutes/" class="wp_rp_title">用 10 分鐘安裝好 Drone 搭配 GitLab</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7006" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/" class="wp_rp_title">[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="7" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>