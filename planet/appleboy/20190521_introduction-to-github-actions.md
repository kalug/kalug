---
title: "GitHub 推出 CI/CD 服務 Actions 之踩雷經驗"
date: 2019-05-21
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/05/introduction-to-github-actions/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/vs6XKU4keYmwiBUeWrTVbYl4WKH7cTcmu6Lcggv0QWEBK81D06mbPg7skrmlnYrUf0JlEzhwjJwtmjVJ4p9wLXmbTs4mmzviiCK1RRwBhRXGom5w_3JSQwnV6UUbfH5Pd9uNNU5SCQE=w1920-h1080" title="GitHub Actions 簡介"><img src="https://lh3.googleusercontent.com/vs6XKU4keYmwiBUeWrTVbYl4WKH7cTcmu6Lcggv0QWEBK81D06mbPg7skrmlnYrUf0JlEzhwjJwtmjVJ4p9wLXmbTs4mmzviiCK1RRwBhRXGom5w_3JSQwnV6UUbfH5Pd9uNNU5SCQE=w1920-h1080" alt="GitHub Actions 簡介" title="GitHub Actions 簡介" /></a></p>
<p>今年很高興又去 <a href="https://cloudsummit.ithome.com.tw/">Cloud Summit 研討會</a>給一場議程『初探 GitHub 自動化流程工具 Actions』，這場議程沒有講很多如何使用 <a href="https://github.com/features/actions">GitHub Actions</a>，反倒是講了很多設計上的缺陷，以及為什麼我現在不推薦使用。GitHub Actions 在去年推出來，在這麼多 CI/CD 的免費服務，GitHub 自家出來做很正常，我還在想到底什麼時候才會推出，beta 版出來馬上就申請來試用，但是使用下來體驗非常的不好，有蠻多不方便的地方，底下我們就來聊聊 GitHub Acitons 有哪些缺陷以及該改進的地方。</p>
<span id="more-7393"></span>
<h2>簡報檔案</h2>
<iframe src="//www.slideshare.net/slideshow/embed_code/key/3Hwbiy4EUpJvsT" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
<h2>無法及時看到 Log 輸出</h2>
<p>如果一個 Job 需要跑 30 分鐘，甚至更久，開發者一定會希望可以即時看到目前輸出了哪些 Log，看到 Log 的檔案，就可以知道下一步該怎麼修改，而不是等到 Job 結束後才可以看到 Log，然而 GitHub Actions 就是這樣神奇，需要等到 Job 跑完，才可以看到完整的 Log，你無法在執行過程看到任何一行 Log。光是這一點，直接打槍了 Firmware 開發者。</p>
<h2>無法直接重新啟動 Job</h2>
<p>通常有時候我們會需要重新跑已經失敗或者是取消的 Job，但是不好意思，GitHub Actions 沒有任何按鈕可以讓你重新跑單一 Commit 的 Job，你必須要重新 push 後，才可以重新啟動 Job，我覺得非常不合理，在 UI 上面有支持 Stop Job，但是不支援 Restart Job，我只能 &#8230;. 了。透過底下可以重新啟動 Job，但是太笨了</p>
<pre><code class="language-shell">$ git reset —soft HEAD^
$ git commit -a -m &quot;foo&quot;
$ git push origin master -f</code></pre>
<h2>不支援 Global Secrets</h2>
<p>假設在一個 organization 底下有 100 個 repository，每個 repository 都需要部署程式到遠端機器，這時候就必須要在每個 repo 設定 SSH Key 在 Secrets 選單內，但是必須要設定 100 次，假設支持在 organization 設定該有多好。</p>
<h2>不支援第三方 Secrets 管理</h2>
<p>除了用 Git 來管理 Secrets 之外，現在很流行透過第三方，像是 <a href="https://www.vaultproject.io/">Vault</a>, <a href="https://aws.amazon.com/tw/secrets-manager/">AWS Secrets</a> 或 <a href="https://kubernetes.io/docs/concepts/configuration/secret/">kubernetes secret</a>，很抱歉，目前還沒支援第三方服務，現在還只能使用 GitHub 後台給的 Secrets 設定。</p>
<h2>強制寫 CLI Flag</h2>
<p>舉個實際例子比較快，現在有個 repo 必須同時部署到兩台密碼不同的 Linux Server，假設 Image 只支援 Password 這 global variable</p>
<pre><code class="language-shell">  secrets = [
    &quot;PASSWORD&quot;,
  ]
  args = [
    &quot;--user&quot;, &quot;actions&quot;,
    &quot;--script&quot;, &quot;whoami&quot;,
  ] </code></pre>
<p>我該怎麼在後台設定兩個不同變數讓 Docker 去讀取，這邊就不能這樣解決，所以開發者必須在程式裡面支援 指定 CLI 變數</p>
<pre><code class="language-shell">  secrets = [
    &quot;PASSWORD01&quot;,
  ]
  args = [
    &quot;-p&quot;, &quot;$PASSWORD01&quot;,
    &quot;--script&quot;, &quot;whoami&quot;,
  ] </code></pre>
<p>如果 Actions 沒有支援 <code>-p</code> 來設定參數，我相信這個套件肯定不能用。這就是 GitHub Actions 的缺點。我們看看 Drone 怎麼實作:</p>
<pre><code class="language-yaml">kind: pipeline
name: default

steps:
- name: build
  image: appleboy/drone-ssh
  environment:
    USERNAME:
      from_secret: username
    PASSWORD:
      from_secret: password </code></pre>
<p>有沒有注意到 <code>from_secret</code> 用來接受多個不同的 variable 變數。</p>
<h2>環境變數太少</h2>
<pre><code class="language-shell">action &quot;Hello World&quot; {
  uses = &quot;./my-action&quot;
  env = {
    FIRST_NAME  = &quot;Mona&quot;
    MIDDLE_NAME = &quot;Lisa&quot;
    LAST_NAME   = &quot;Octocat&quot;
  }
} </code></pre>
<p>在 Actions 內開發者可以拿到底下變數內容</p>
<ul>
<li>GITHUB_WORKFLOW</li>
<li>GITHUB_ACTION</li>
<li>GITHUB_EVNETNAME</li>
<li>GITHUB_SHA</li>
<li>GITHUB_REF</li>
</ul>
<p>大家有沒有發現，那這個 commit 的作者或者是 commit message 該去哪邊拿？沒有這些資訊我怎麼寫 chat bot 發通知呢？該不會要開發者自己在打 RESTful API 吧？</p>
<h2>心得</h2>
<p>上面這些缺陷，真的讓大家用不下去，如果你再評估 GitHub Actions 的時候，可以參考看看這邊是否已經改善了？可以參考<a href="https://github.com/appleboy?utf8=%E2%9C%93&amp;tab=repositories&amp;q=actions&amp;type=&amp;language=">我開發的 GitHub Actions</a>。</p>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6467" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/07/upgrade-docker-and-docker-compose-on-travis/" class="wp_rp_title">在 Travis 升級 Docker 和 docker-compose 版本</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="1" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7298" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/03/setup-traefik-with-drone-ci-cd-in-ten-minutes/" class="wp_rp_title">10 分鐘內用 Traefik 架設 Drone 搭配 GitHub 服務</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7217" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/traefik-docker-and-lets-encrypt/" class="wp_rp_title">Traefik 搭配 Docker 自動更新 Let&#8217;s Encrypt 憑證</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="4" data-poid="in-7263" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/using-cache-from-can-speed-up-your-docker-builds/" class="wp_rp_title">在 docker-in-docker 環境中使用 cache-from 提升編譯速度</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="5" data-poid="in-7458" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/09/upload-docker-image-to-github-registry-using-drone/" class="wp_rp_title">用 Drone 自動化上傳 Docker Image 到 GitHub Docker Registry</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7137" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/docker-testing-with-flutter-sdk/" class="wp_rp_title">用 Docker 整合測試 Flutter 框架</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6945" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/introduction-to-drone-cicd/" class="wp_rp_title">Drone CI/CD 系統簡介</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6493" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/build-microservices-in-golang/" class="wp_rp_title">2016 COSCUP 用 Golang 寫 Microservices</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>