---
title: "Go 語言專案程式碼品質"
date: 2018-09-20
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/09/golang-project-quality/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/39050902230/in/dateposted-public/" title="Screen Shot 2018-03-17 at 11.40.12 PM"><img src="https://i2.wp.com/farm1.staticflickr.com/805/39050902230_b1d91bc120_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-03-17 at 11.40.12 PM" data-recalc-dims="1" /></a>

本篇想介紹我在寫開源專案會用到的工具及服務，其實在編譯 <a href="https://golang.org">Go 語言</a>同時，就已經確保了一次程式碼品質，或者是在編譯之前會跑 <code>go fmt</code> 或 <code>go vet</code> 的驗證，網路上也蠻多工具可以提供更多驗證，像是：

<ul>
<li>errcheck (檢查是否略過錯誤驗證)</li>
<li>unused (檢查沒用到的 func, variable or const)</li>
<li>structcheck (檢查 struct 內沒有用到的 field)</li>
<li>varcheck (拿掉沒有用到的 const 變數)</li>
<li>deadcode (沒有用到的程式碼)</li>
</ul>

但是這麼多驗證工具，要一一導入專案，實在有點麻煩，我自己在公司內部只有驗證 <code>go fmt</code> 或 <code>go vet</code> 或 <a href="github.com/client9/misspell">misspell-check</a> (驗證英文單字是否錯誤) 及 <a href="https://github.com/kardianos/govendor">vendor-check</a> (驗證開發者是否有去修改過 vendor 而沒有恢復修正)。如果你有在玩開源專案，其實可以不用這麼麻煩，導入兩套工具就可以讓你安心驗證別人發的 PR。底下來介紹一套工具及另外一套雲端服務。

<span id="more-7087"></span>

<h2>影片介紹</h2>

我錄製了一段影片介紹這兩套工具及服務，不想看本文的可以直接看影片

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/lXzQ8ZHUpPY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<hr />

此影片同步在 <a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-TOP">Udemy 課程</a>內，如果有購買課程的朋友們，也可以在 Udemy 上面觀看，如果想學習更多 Go 語言教學，現在可以透過 <strong>$1800</strong> 價格購買。

<h2><a href="https://golangci.com/">golangci.com</a> 服務</h2>

先說好這<a href="https://golangci.com/">套服務</a>對於私有專案是需要付費的，如果是開源專案，請盡情使用，目前只有支援 GitHub 上面的專案為主，不支援像是 GitLab 或 Bitbucket。對於有在寫 Go 開源專案的開發者，務必啟用這服務，此服務幫忙驗證超多檢查，請看底下

<a href="https://www.flickr.com/photos/appleboy/44793421681/in/dateposted-public/" title="Screen Shot 2018-09-20 at 9.36.50 AM"><img src="https://i0.wp.com/farm2.staticflickr.com/1862/44793421681_3904269fcb_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-09-20 at 9.36.50 AM" data-recalc-dims="1" /></a>

當然不只有幫忙整合 CI/CD 的功能，還會在每個 PR 只要遇到驗證錯誤，直接會有 Bot 留言

<a href="https://www.flickr.com/photos/appleboy/43883330085/in/dateposted-public/" title="Check_if_token_expired_in_MiddlewareFunc_by_a180285_·_Pull_Request__169_·_appleboy_gin-jwt_&#x1f50a;"><img src="https://i0.wp.com/farm2.staticflickr.com/1897/43883330085_69c9627d22_z.jpg?w=840&#038;ssl=1" alt="Check_if_token_expired_in_MiddlewareFunc_by_a180285_·_Pull_Request__169_·_appleboy_gin-jwt_&#x1f50a;" data-recalc-dims="1" /></a>

非常的方便，假設您的團隊有在 GitHub 使用，強烈建議導入這套服務。另外也可以進入 Repo 列表內看到詳細的錯誤清單。

<a href="https://www.flickr.com/photos/appleboy/29857249697/in/dateposted-public/" title="Report_for_Pull_Request_appleboy_gorush_undefined_&#x1f50a;"><img src="https://i0.wp.com/farm2.staticflickr.com/1896/29857249697_2257aee20f_z.jpg?w=840&#038;ssl=1" alt="Report_for_Pull_Request_appleboy_gorush_undefined_&#x1f50a;" data-recalc-dims="1" /></a>

<h2>go-critic 工具</h2>

<a href="https://go-critic.github.io/">go-critic</a> 也是一套檢查程式碼品質的工具，只提供 CLI 方式驗證，不提供雲端整合服務，如果要導入 CI/CD 流程，請自行取用，為什麼特別介紹這套，這套工具其實是在幫助您如何寫出 Best Practice 的 Go 語言程式碼，就算你不打算用這套工具，那推薦壹定要閱讀完<a href="https://go-critic.github.io/overview.html">驗證清單</a>，這會讓專案的程式碼品質再提升。像是寫 Bool 函式，可能會這樣命名:

<pre class="brush: go; title: ; notranslate">
func Enabled() bool
</pre>

用了此工具，會建議寫成 (是不是更好閱讀了)

<pre class="brush: go; title: ; notranslate">
func IsEnabled() bool
</pre>

還有很多驗證請自行參考，不過此工具會根據專案的大小來決定執行時間，所以我個人不推薦導入 CI/CD 流程，而是久久可以在自己電腦跑一次，一次性修改全部，這樣才不會影響部署時間。

<h2>心得</h2>

上面提供的兩套工具及服務，大家如果有興趣，歡迎導入，第一套雲服務我個人都用在開源專案，第二套工具，會用在公司內部專案，但是不會導入在 CI/CD 流程內。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7098" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/10/go-1-11-support-go-module/" class="wp_rp_title">Go 語言 1.11 版本推出 go module</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (10)</small><br /></li><li data-position="2" data-poid="in-6634" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/01/new-git-code-hosting-option-gitea/" class="wp_rp_title">開發者另類的自架 Git 服務選擇: Gitea</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="3" data-poid="in-6370" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/sourcegraph-chrome-extension-for-github/" class="wp_rp_title">在 Github 專案內搜尋 Golang 函式，Golang 開發者必裝 Chrome Extension</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="4" data-poid="in-6700" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/introduction-to-gitea-in-digitalocean-hsinchu/" class="wp_rp_title">在 DigitalOcean 新竹社群簡介 Gitea 開源專案</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6858" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/10/go-configuration-with-viper/" class="wp_rp_title">在 Go 語言使用 Viper 管理設定檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6674" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/golang-dependency-management-tool-dep/" class="wp_rp_title">Go 語言官方推出的 dep 使用心得</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="7" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-7092" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/gofight-support-upload-file-testing/" class="wp_rp_title">gofight 支援多個檔案上傳測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6342" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/package-management-for-golang-glide/" class="wp_rp_title">Golang 套件管理工具 Glide</a><small class="wp_rp_comments_count"> (2)</small><br /></li></ul></div></div>