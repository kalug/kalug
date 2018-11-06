---
title: "用 Drone CI/CD 整合 Packer 自動產生 GCP 或 AWS 映像檔"
date: 2018-07-29
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/07/drone-with-hashicorp-packer/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/43657047222/in/dateposted-public/" title="Screen Shot 2018-07-29 at 12.47.51 PM"><img src="https://i1.wp.com/farm1.staticflickr.com/856/43657047222_387563a137_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-07-29 at 12.47.51 PM" data-recalc-dims="1" /></a>

本篇來介紹 <a href="https://www.hashicorp.com/">Hashicorp</a> 旗下其中一個產品叫 <a href="https://www.packer.io">Packer</a>，其實在 Hashicorp 旗下有很多其他雲端工具都非常好用，如果大家有興趣都可以上<a href="https://www.hashicorp.com/">官網</a>參考看看。而 Packer 是用來產生各大雲平台映像檔的工具，平行產生 <a href="https://aws.amazon.com/">AWS</a>, <a href="https://cloud.google.com/">GCP</a>, <a href="https://www.docker.com/">Docker</a> 或 <a href="https://www.digitalocean.com/">DigitalOcean</a> &#8230; 等等眾多雲平台之映像檔對 Packer 來說相當容易，詳細可以<a href="https://www.packer.io/docs/builders/index.html">參考這邊</a>，也就是說透過 Packer 來統一管理各大雲平台的映像檔，用 JSON 檔案進行版本控制。假設您有需求要管理工程團隊所使用的 Image，你絕對不能錯過 Packer。Packer 不是用來取代像是 <a href="https://www.ansible.com/">Ansible</a> 或是 <a href="https://www.chef.io/chef/">Chef</a> 等軟體，而是讓開發者更方便整合 Ansible .. 等第三方工具，快速安裝好系統環境。

<span id="more-7056"></span>

<h2>影片教學</h2>

如果不想看底下文字介紹，可以直接參考 Youtube 影片:

<iframe width="640" height="360" src="https://www.youtube.com/embed/oR3wbdYikIQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

如果您對 Drone 整合 Docker 有興趣，可以直接參考線上課程

<ul>
<li><a href="https://www.udemy.com/devops-oneday/?couponCode=DRONE-DEVOPS">一天學會 DEVOPS 自動化流程</a> $1800</li>
</ul>

買了結果沒興趣想退費怎麼辦？沒關係，在 Udemy 平台 30 天內都可以全額退費，所以不用擔心買了後悔。

<h2>自動建立 AWS AMI 映像檔</h2>

不多說直接拿實際例子來實做看看，假設我們有個需求，就是需要產生一個 AMI 裡面已經內建包含了 Docker 服務，該如何來實現呢？底下是 Packer 所撰寫的 JSON 檔案，底下範例可以直接在<a href="https://github.com/go-ggz/packer/blob/0c171e6af8cc1a4602f8d0d74504c67029ce2205/ggz.json">這邊</a>找到

<pre class="brush: plain; title: ; notranslate">
{
  &quot;variables&quot;: {
    &quot;aws_access_key&quot;: &quot;{{env `AWS_ACCESS_KEY_ID`}}&quot;,
    &quot;aws_secret_key&quot;: &quot;{{env `AWS_SECRET_ACCESS_KEY`}}&quot;,
    &quot;ssh_bastion_host&quot;: &quot;&quot;,
    &quot;ssh_bastion_port&quot;: &quot;22&quot;,
    &quot;ssh_bastion_username&quot;: &quot;&quot;,
    &quot;ssh_bastion_private_key_file&quot;: &quot;&quot;,
    &quot;region&quot;: &quot;ap-southeast-1&quot;
  },
  &quot;builders&quot;: [{
    &quot;type&quot;: &quot;amazon-ebs&quot;,
    &quot;access_key&quot;: &quot;{{user `aws_access_key`}}&quot;,
    &quot;secret_key&quot;: &quot;{{user `aws_secret_key`}}&quot;,
    &quot;region&quot;: &quot;{{user `region`}}&quot;,
    &quot;source_ami_filter&quot;: {
      &quot;filters&quot;: {
        &quot;virtualization-type&quot;: &quot;hvm&quot;,
        &quot;name&quot;: &quot;ubuntu/images/*ubuntu-xenial-16.04-amd64-server-*&quot;,
        &quot;root-device-type&quot;: &quot;ebs&quot;
      },
      &quot;owners&quot;: [&quot;099720109477&quot;],
      &quot;most_recent&quot;: true
    },
    &quot;instance_type&quot;: &quot;t2.micro&quot;,
    &quot;ssh_username&quot;: &quot;ubuntu&quot;,
    &quot;ami_name&quot;: &quot;ggz-docker-image-{{isotime | clean_ami_name}}&quot;,
    &quot;tags&quot;: {
      &quot;Name&quot;: &quot;ggz&quot;,
      &quot;Environment&quot;: &quot;production&quot;
    },
    &quot;communicator&quot;: &quot;ssh&quot;,
    &quot;ssh_bastion_host&quot;: &quot;{{user `ssh_bastion_host`}}&quot;,
    &quot;ssh_bastion_port&quot;: &quot;{{user `ssh_bastion_port`}}&quot;,
    &quot;ssh_bastion_username&quot;: &quot;{{user `ssh_bastion_username`}}&quot;,
    &quot;ssh_bastion_private_key_file&quot;: &quot;{{user `ssh_bastion_private_key_file`}}&quot;
  }],
  &quot;provisioners&quot;: [{
      &quot;type&quot;: &quot;file&quot;,
      &quot;source&quot;: &quot;{{template_dir}}/welcome.txt&quot;,
      &quot;destination&quot;: &quot;/home/ubuntu/&quot;
    },
    {
      &quot;type&quot;: &quot;shell&quot;,
      &quot;script&quot;: &quot;{{template_dir}}/docker.sh&quot;,
      &quot;execute_command&quot;: &quot;echo &#039;ubuntu&#039; | sudo -S sh -c &#039;{{ .Vars }} {{ .Path }}&#039;&quot;
    }
  ]
}
</pre>

第一部分 <code>variables</code> 讓開發者可以定義變數，可以讀取系統環境變數，第二部分 <code>builders</code> 就是用來定義要產生不同平台的 Image，像是 GCP 或 AWS，可以看到是傳入一個 Array 值，上面的例子就是要產生 <a href="https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/AMIs.html">AWS AMI</a>，所以設定 <code>"type": "amazon-ebs"</code>，第三部分 <code>provisioners</code>，就是來寫 script，映像檔預設可能會有一些檔案，或者是預設安裝一些工具，看到 type 可以是 <code>file</code>、<code>shell</code> 等等，也就是說 <code>provisioners</code> 可以讓開發者安裝套件，更新 Kernel，建立使用者，或者是安裝下載 application source code。這對於部署來說是一個非常棒的工具。

<h2>執行 Packer</h2>

完成上述 JSON 檔案後，就可以透過 Packer 來產生 <a href="https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/AMIs.html">AWS AMI</a> 了

<pre class="brush: plain; title: ; notranslate">
$ packer build -var-file=config/mcs.json mcs.json
amazon-ebs output will be in this color.

==&gt; amazon-ebs: Prevalidating AMI Name: ggz-docker-image-2018-07-29T06-11-12Z
    amazon-ebs: Found Image ID: ami-1c6627f6
==&gt; amazon-ebs: Creating temporary keypair: packer_5b5d5a80-c1e2-e266-e0b8-bc7c6e63dba3
==&gt; amazon-ebs: Creating temporary security group for this instance: packer_5b5d5a82-5d1f-c702-18f4-992ac37e885a
==&gt; amazon-ebs: Authorizing access to port 22 from 0.0.0.0/0 in the temporary security group...
==&gt; amazon-ebs: Launching a source AWS instance...
==&gt; amazon-ebs: Adding tags to source instance
    amazon-ebs: Adding tag: &quot;Name&quot;: &quot;Packer Builder&quot;
    amazon-ebs: Instance ID: i-0d12e2a9e6f00a410
==&gt; amazon-ebs: Waiting for instance (i-0d12e2a9e6f00a410) to become ready...
</pre>

透過 <code>-var-file</code> 將隱秘資訊寫到檔案內，像是 AWS Secret Key 等等。

<h2>整合 Drone CI/CD</h2>

上一個步驟可以透過指令方式完成映像檔，本章節會教大家如何跟 <a href="https://drone.io">Drone</a> 整合，這邊可以直接使用 <a href="https://github.com/appleboy/drone-packer">drone-packer</a> 套件，<a href="http://plugins.drone.io/appleboy/drone-packer/">使用文件</a>也已經放到 <a href="http://plugins.drone.io/">drone plugin</a> 首頁了。使用方式非常簡單，請參考底下範例:

<pre class="brush: plain; title: ; notranslate">
pipeline:
  packer:
    image: appleboy/drone-packer
    pull: true
    secrets: [ aws_access_key_id, aws_secret_access_key ]
    template: ggz.json
    actions:
      - validate
      - build
    when:
      branch: master
</pre>

其中 template 請輸入 json 檔案路徑，actions 目前只有支援 <code>validate</code> 跟 <code>build</code>，我建議兩者都寫，先驗證 json 檔案是否寫錯，再執行 build。另外我們可以看到

<pre class="brush: plain; title: ; notranslate">
  &quot;variables&quot;: {
    &quot;aws_access_key&quot;: &quot;{{env `AWS_ACCESS_KEY_ID`}}&quot;,
    &quot;aws_secret_key&quot;: &quot;{{env `AWS_SECRET_ACCESS_KEY`}}&quot;
  },
</pre>

其中 <code>aws_access_key</code> 是讀取系統環境變數 <code>AWS_ACCESS_KEY_ID</code>，所以可以透過 <code>drone secret</code> 將變數設定上去

<pre class="brush: plain; title: ; notranslate">
$ drone secret add \
  -repository go-ggz/packer \
  -image appleboy/drone-packer \
  -event push \
  -name aws_access_key_id \
  -value xxxxxx
</pre>

請注意記得將敏感資訊綁定在 <code>-image</code> 身上，避免被偷走。上面的範例，可以直接參考 <a href="https://github.com/go-ggz/packer">go-ggz/packer</a>。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7006" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/how-to-use-filter-in-drone/" class="wp_rp_title">[影片教學] 使用 Filter 將專案跑在特定 Drone Agent 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6925" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/12/drone-cli-local-testing/" class="wp_rp_title">在本機端導入 Drone CLI 做專案測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6904" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/drone-secret-security/" class="wp_rp_title">Drone Secret 安全性管理</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-7108" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/deploy-app-to-aws-lambda-using-up-tool-in-ten-minutes/" class="wp_rp_title">用 10 分鐘部署專案到 AWS Lambda</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6825" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/drone-on-kubernetes-on-aws/" class="wp_rp_title">用 Kubernetes 將 Drone CI/CD 架設在 AWS</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6846" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/10/upgrade-kubernetes-container-using-drone/" class="wp_rp_title">Drone 搭配 Kubernetes 升級應用程式版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>