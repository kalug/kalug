---
title: "有效率的用 jsonnet 撰寫  Drone CI/CD 設定檔"
date: 2019-01-25
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/01/converts-a-jsonnet-configuration-file-to-a-yaml-in-drone/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/z8q-kl8yaWy9LtUDNEluPfDiHouz0Q7GnQZDStid8j4CmOwgP9uZJsTOCXjmSzTTApmL6fukANr6UbEGAaebb5_iJ1j5LoXPFKtrrf_FdLOGFpt9zyYvdPo8OdpzrZ3qJDDx9CkanNM=w1920-h1080" title="Jsonnet + Drone"><img src="https://lh3.googleusercontent.com/z8q-kl8yaWy9LtUDNEluPfDiHouz0Q7GnQZDStid8j4CmOwgP9uZJsTOCXjmSzTTApmL6fukANr6UbEGAaebb5_iJ1j5LoXPFKtrrf_FdLOGFpt9zyYvdPo8OdpzrZ3qJDDx9CkanNM=w1920-h1080" alt="Jsonnet + Drone" title="Jsonnet + Drone" /></a></p>
<p><a href="https://github.com/drone/drone">Drone</a> 在 1.0 版本推出了用 <a href="https://jsonnet.org">jsonnet</a> 來撰寫 <a href="https://en.wikipedia.org/wiki/YAML">YAML</a> 設定檔，方便開發者可以維護多個專案設定。不知道大家有無遇過在啟動新的專案後，需要從舊的專案複製設定到新專案，或者是在 <code>.drone.yml</code> 內有非常多重複性的設定，假設 <a href="https://golang.org" title="Go 語言">Go 語言</a>的開源專案需要將執行檔包成 ARM64 及 AMD64 的映像檔，並且上傳到 <a href="https://hub.docker.com/" title="Docker Hub">Docker Hub</a>，底下是 AMD64 的設定檔範例。剛好在 <a href="https://www.udemy.com/devops-oneday" title="Udemy 課程">Udemy 課程</a>內有學員詢問到<a href="https://www.udemy.com/devops-oneday/learn/v4/questions/6162884">相關問題</a>。</p>
<pre><code class="language-yaml">---
kind: pipeline
name: linux-arm64

platform:
  os: linux
  arch: arm64

steps:
- name: build-push
  pull: always
  image: golang:1.11
  commands:
  - "go build -v -ldflags \"-X main.build=${DRONE_BUILD_NUMBER}\" -a -o release/linux/arm64/drone-discord"
  environment:
    CGO_ENABLED: 0
    GO111MODULE: on
  when:
    event:
    - push
    - pull_request

- name: build-tag
  pull: always
  image: golang:1.11
  commands:
  - "go build -v -ldflags \"-X main.version=${DRONE_TAG##v} -X main.build=${DRONE_BUILD_NUMBER}\" -a -o release/linux/arm64/drone-discord"
  environment:
    CGO_ENABLED: 0
    GO111MODULE: on
  when:
    event:
    - tag

- name: executable
  pull: always
  image: golang:1.11
  commands:
  - ./release/linux/arm64/drone-discord --help

- name: dryrun
  pull: always
  image: plugins/docker:linux-arm64
  settings:
    dockerfile: docker/Dockerfile.linux.arm64
    dry_run: true
    password:
      from_secret: docker_password
    repo: appleboy/drone-discord
    tags: linux-arm64
    username:
      from_secret: docker_username
  when:
    event:
    - pull_request

- name: publish
  pull: always
  image: plugins/docker:linux-arm64
  settings:
    auto_tag: true
    auto_tag_suffix: linux-arm64
    dockerfile: docker/Dockerfile.linux.arm64
    password:
      from_secret: docker_password
    repo: appleboy/drone-discord
    username:
      from_secret: docker_username
  when:
    event:
    - push
    - tag

trigger:
  branch:
  - master</code></pre>
<span id="more-7226"></span>
<p>大家可以看到上面總共快 80 行，如果要再支援 ARM 64，這時候就需要重新複製再貼上，並且把相關設定改掉，有沒有覺得這樣非常難維護 <code>.drone.yml</code>。Drone 的作者聽到大家的聲音了，在 1.0 版本整合了 <a href="https://jsonnet.org/">jsonnet</a> 這套 Data Templating Language，讓您可以寫一次代碼並產生出好幾種環境。底下簡單看一個例子:</p>
<pre><code class="language-json">// A function that returns an object.
local Person(name='Alice') = {
  name: name,
  welcome: 'Hello ' + name + '!',
};
{
  person1: Person(),
  person2: Person('Bob'),
}</code></pre>
<p>透過 jsonnet 指令可以轉換如下:</p>
<pre><code class="language-json">{
  "person1": {
    "name": "Alice",
    "welcome": "Hello Alice!"
  },
  "person2": {
    "name": "Bob",
    "welcome": "Hello Bob!"
  }
}</code></pre>
<p>那該如何改 drone 設定檔方便未來多個專案一起維護呢？</p>
<h2>影片教學</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/ySqjSdeWzQw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<ul>
<li>Go 語言實戰課程: <a href="http://bit.ly/golang-2019">http://bit.ly/golang-2019</a></li>
<li>Drone 自動化課程: <a href="http://bit.ly/drone-2019">http://bit.ly/drone-2019</a></li>
</ul>
<h2>安裝 drone CLI 執行檔</h2>
<p>請直接參考<a href="https://docs.drone.io/cli/install/">官方文件</a>就可以了，這邊不再詳細介紹，底下是 Mac 範例 (安裝的是 <a href="https://github.com/drone/drone-cli/releases/tag/v1.0.5" title="Drone v1.0.5">Drone v1.0.5</a>):</p>
<pre><code class="language-sh">$ curl -L https://github.com/drone/drone-cli/releases/download/v1.0.5/drone_darwin_amd64.tar.gz | tar zx
$ sudo cp drone /usr/local/bin</code></pre>
<p>安裝完成後，還需要設定<a href="https://docs.drone.io/cli/setup/">環境變數</a>，才可以跟您的 Drone 伺服器溝通。</p>
<pre><code class="language-sh">$ drone
NAME:
   drone - command line utility

USAGE:
   drone [global options] command [command options] [arguments...]

VERSION:
   1.0.5

COMMANDS:
     build      manage builds
     cron       manage cron jobs
     log        manage logs
     encrypt    encrypt a secret
     exec       execute a local build
     info       show information about the current user
     repo       manage repositories
     user       manage users
     secret     manage secrets
     server     manage servers
     queue      queue operations
     autoscale  manage autoscaling
     fmt        format the yaml file
     convert    convert legacy format
     lint       lint the yaml file
     sign       sign the yaml file
     jsonnet    generate .drone.yml from jsonnet
     plugins    plugin helper functions</code></pre>
<h2>撰寫 .drone.jsonnet 檔案</h2>
<p>在專案目錄內放置 <code>.drone.jsonnet</code> 檔案，拿 Go 專案當範例：</p>
<ol>
<li>驗證程式碼品質</li>
<li>編譯執行檔 </li>
<li>包成 Docker 容器 </li>
<li>上傳到 Docker Hub </li>
<li>消息通知</li>
</ol>
<pre><code class="language-json">local PipelineTesting = {
  kind: "pipeline",
  name: "testing",
  platform: {
    os: "linux",
    arch: "amd64",
  },
  steps: [
    {
      name: "vet",
      image: "golang:1.11",
      pull: "always",
      environment: {
        GO111MODULE: "on",
      },
      commands: [
        "make vet",
      ],
    },
    {
      name: "lint",
      image: "golang:1.11",
      pull: "always",
      environment: {
        GO111MODULE: "on",
      },
      commands: [
        "make lint",
      ],
    },
    {
      name: "misspell",
      image: "golang:1.11",
      pull: "always",
      environment: {
        GO111MODULE: "on",
      },
      commands: [
        "make misspell-check",
      ],
    },
    {
      name: "test",
      image: "golang:1.11",
      pull: "always",
      environment: {
        GO111MODULE: "on",
        WEBHOOK_ID: { "from_secret": "webhook_id" },
        WEBHOOK_TOKEN: { "from_secret": "webhook_token" },
      },
      commands: [
        "make test",
        "make coverage",
      ],
    },
    {
      name: "codecov",
      image: "robertstettner/drone-codecov",
      pull: "always",
      settings: {
        token: { "from_secret": "codecov_token" },
      },
    },
  ],
  trigger: {
    branch: [ "master" ],
  },
};

local PipelineBuild(os="linux", arch="amd64") = {
  kind: "pipeline",
  name: os + "-" + arch,
  platform: {
    os: os,
    arch: arch,
  },
  steps: [
    {
      name: "build-push",
      image: "golang:1.11",
      pull: "always",
      environment: {
        CGO_ENABLED: "0",
        GO111MODULE: "on",
      },
      commands: [
        "go build -v -ldflags \"-X main.build=${DRONE_BUILD_NUMBER}\" -a -o release/" + os + "/" + arch + "/drone-discord",
      ],
      when: {
        event: [ "push", "pull_request" ],
      },
    },
    {
      name: "build-tag",
      image: "golang:1.11",
      pull: "always",
      environment: {
        CGO_ENABLED: "0",
        GO111MODULE: "on",
      },
      commands: [
        "go build -v -ldflags \"-X main.version=${DRONE_TAG##v} -X main.build=${DRONE_BUILD_NUMBER}\" -a -o release/" + os + "/" + arch + "/drone-discord",
      ],
      when: {
        event: [ "tag" ],
      },
    },
    {
      name: "executable",
      image: "golang:1.11",
      pull: "always",
      commands: [
        "./release/" + os + "/" + arch + "/drone-discord --help",
      ],
    },
    {
      name: "dryrun",
      image: "plugins/docker:" + os + "-" + arch,
      pull: "always",
      settings: {
        dry_run: true,
        tags: os + "-" + arch,
        dockerfile: "docker/Dockerfile." + os + "." + arch,
        repo: "appleboy/drone-discord",
        username: { "from_secret": "docker_username" },
        password: { "from_secret": "docker_password" },
      },
      when: {
        event: [ "pull_request" ],
      },
    },
    {
      name: "publish",
      image: "plugins/docker:" + os + "-" + arch,
      pull: "always",
      settings: {
        auto_tag: true,
        auto_tag_suffix: os + "-" + arch,
        dockerfile: "docker/Dockerfile." + os + "." + arch,
        repo: "appleboy/drone-discord",
        username: { "from_secret": "docker_username" },
        password: { "from_secret": "docker_password" },
      },
      when: {
        event: [ "push", "tag" ],
      },
    },
  ],
  depends_on: [
    "testing",
  ],
  trigger: {
    branch: [ "master" ],
  },
};

local PipelineNotifications = {
  kind: "pipeline",
  name: "notifications",
  platform: {
    os: "linux",
    arch: "amd64",
  },
  clone: {
    disable: true,
  },
  steps: [
    {
      name: "microbadger",
      image: "plugins/webhook:1",
      pull: "always",
      settings: {
        url: { "from_secret": "microbadger_url" },
      },
    },
  ],
  depends_on: [
    "linux-amd64",
    "linux-arm64",
    "linux-arm",
  ],
  trigger: {
    branch: [ "master" ],
    event: [ "push", "tag" ],
  },
};

[
  PipelineTesting,
  PipelineBuild("linux", "amd64"),
  PipelineBuild("linux", "arm64"),
  PipelineBuild("linux", "arm"),
  PipelineNotifications,
]</code></pre>
<p>大家可以看到 <code>local PipelineBuild</code> 就是一個 func 函數，可以用來產生不同的環境代碼</p>
<pre><code class="language-sh">  PipelineBuild("linux", "amd64"),
  PipelineBuild("linux", "arm64"),
  PipelineBuild("linux", "arm"),</code></pre>
<p>完成後，直接在專案目錄下執行</p>
<pre><code class="language-sh">$ drone jsonnet --stream</code></pre>
<p>您會發現專案下的 <code>.drone.yml</code> 已經成功修正，未來只要將變動部分抽成變數，就可以產生不同專案的環境，開發者就不需要每次手動修改很多變動的地方。至於要不要把 <code>.drone.jsonnet</code> 放入專案內進行版本控制就看情境了。其實可以另外開一個新的 Repo 放置 <code>.drone.jsonnet</code>，未來新專案開案，就可以快速 clone 下來，並且產生新專案的 <code>.drone.yml</code> 設定檔。底下是 Drone 執行結果:</p>
<p><a href="https://lh3.googleusercontent.com/n--AFC5iMIrQGufEyoiM2dag3ibgEyQACRzx4ZapvNDsJz-WjY1qRzei4a6Ov0URrjsVGX6S9eEa4p9cw3so08AtPpRM1iANCGxtRhh109cnV21ZXC-Bg1a6GzltV0G8QxCfqpMiIsc=w1920-h1080" title="Drone Output"><img src="https://lh3.googleusercontent.com/n--AFC5iMIrQGufEyoiM2dag3ibgEyQACRzx4ZapvNDsJz-WjY1qRzei4a6Ov0URrjsVGX6S9eEa4p9cw3so08AtPpRM1iANCGxtRhh109cnV21ZXC-Bg1a6GzltV0G8QxCfqpMiIsc=w1920-h1080" alt="Drone Output" title="Drone Output" /></a></p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7170" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/go-module-integrate-with-travis-or-drone/" class="wp_rp_title">Go Module 導入到專案內且搭配 Travis CI 或 Drone 工具</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="1" data-poid="in-7115" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/drone-release-1-0-0-rc1/" class="wp_rp_title">開源專案 Drone 推出 1.0.0 RC1 版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-7120" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/11/install-drone-in-single-machine/" class="wp_rp_title">Drone 支援單機版安裝 (內附影片)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7108" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/deploy-app-to-aws-lambda-using-up-tool-in-ten-minutes/" class="wp_rp_title">用 10 分鐘部署專案到 AWS Lambda</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6925" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/12/drone-cli-local-testing/" class="wp_rp_title">在本機端導入 Drone CLI 做專案測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7280" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/gitea-support-oauth-provider/" class="wp_rp_title">開源專案 Gitea 支援 OAuth Provider</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>