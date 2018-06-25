---
title: "Go 語言搭配 Docker Healthy Check 檢查"
date: 2018-03-19
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/03/docker-healthcheck-in-golang/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/39050902230/in/dateposted-public/" title="Screen Shot 2018-03-17 at 11.40.12 PM"><img src="https://i2.wp.com/farm1.staticflickr.com/805/39050902230_b1d91bc120_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-03-17 at 11.40.12 PM" data-recalc-dims="1" /></a>

在 <a href="https://www.docker.com">Docker</a> 1.12 版本後，提供了 <code>HEALTHCHECK</code> 指令，通過指定的一行命令來判斷容器內的服務是否正常運作。在此之前大部分都是透過判斷程式是否 Crash 來決定容器是否存活，但是這地方有點風險的是，假設服務並非 crash，而是沒辦法退出容器，造成無法接受新的請求，這就確保容器存活。現在呢我們可以透過在 <code>Dockerfile</code> 內指定 <code>HEALTHCHECK</code> 指令來確保服務是否正常。而用 <a href="https://golang.org">Go 語言</a>開發的 Web 服務該如何來實現呢？

<span id="more-6982"></span>

<h2>建立 /healthz 路由</h2>

透過簡單的路由 <code>/healthz</code> 直接回傳 200 status code 即可 (使用 <a href="https://github.com/gin-gonic/gin">Gin</a> 當例子)。

<pre class="brush: go; title: ; notranslate">
func heartbeatHandler(c *gin.Context) {
    c.AbortWithStatus(http.StatusOK)
}
</pre>

透過瀏覽器 <code>http://localhost:8080/healthz</code> 可以得到空白網頁，但是打開 console 可以看到正確回傳值。

<a href="https://www.flickr.com/photos/appleboy/26990632808/in/dateposted-public/" title="Snip20180317_4"><img src="https://i1.wp.com/farm5.staticflickr.com/4774/26990632808_d800bc3800_z.jpg?w=840&#038;ssl=1" alt="Snip20180317_4" data-recalc-dims="1" /></a>

<h2>建立 ping 指令</h2>

透過 <code>net/http</code> 套件可以快速寫個驗證接口的函式

<pre class="brush: go; title: ; notranslate">
func pinger() error {
    resp, err := http.Get(&quot;http://localhost:8080/healthz&quot;)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    if resp.StatusCode != 200 {
        return fmt.Errorf(&quot;server returned non-200 status code&quot;)
    }
    return nil
}
</pre>

<h2>增加 HEALTHCHECK 指令</h2>

在 <code>Dockerfile</code> 內增加底下內容:

<pre class="brush: plain; title: ; notranslate">
HEALTHCHECK --start-period=2s --interval=10s --timeout=5s \
  CMD [&quot;/bin/gorush&quot;, &quot;--ping&quot;]
</pre>

<ul>
<li><strong>&#8211;start-period</strong>: 容器啟動後需要等待幾秒，預設為 0 秒</li>
<li><strong>&#8211;interval</strong>: 偵測間隔時間，預設為 30 秒</li>
<li><strong>&#8211;timeout</strong>: 檢查超時時間</li>
</ul>

重新編譯容器，並且啟動容器，會看到初始狀態為 <code>(health: starting)</code>

<a href="https://www.flickr.com/photos/appleboy/40861013721/in/dateposted-public/" title="Snip20180317_5"><img src="https://i2.wp.com/farm1.staticflickr.com/788/40861013721_d7327500f9_z.jpg?w=840&#038;ssl=1" alt="Snip20180317_5" data-recalc-dims="1" /></a>

經過 10 秒後，就會執行指定的指令，就可以知道容器健康與否，最後狀態為 <code>(healtyy)</code>。

<a href="https://www.flickr.com/photos/appleboy/39051186800/in/dateposted-public/" title="Snip20180317_6"><img src="https://i1.wp.com/farm1.staticflickr.com/783/39051186800_ee9a838403_z.jpg?w=840&#038;ssl=1" alt="Snip20180317_6" data-recalc-dims="1" /></a>

最後可以透過 <code>docker inspect</code> 指令來知道容器的狀態列表 (JSON 格式)

<pre class="brush: plain; title: ; notranslate">
$ docker inspect --format &#039;{{json .State.Health}}&#039; gorush | jq
</pre>

<a href="https://www.flickr.com/photos/appleboy/40861130401/in/dateposted-public/" title="Snip20180318_8"><img src="https://i1.wp.com/farm5.staticflickr.com/4781/40861130401_08ca9e2cce_z.jpg?w=840&#038;ssl=1" alt="Snip20180318_8" data-recalc-dims="1" /></a>

從上圖可以知道每隔 10 秒 Docker 就會自動偵測一次。有了上述這些資料，就可以來寫系統報警通知了。如果對 Go 語言有興趣，可以參考<a href="http://bit.ly/intro-golang">線上課程</a>。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="1" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="2" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6825" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/drone-on-kubernetes-on-aws/" class="wp_rp_title">用 Kubernetes 將 Drone CI/CD 架設在 AWS</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6507" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/09/drone-ci-server-integrate-atlassian-bitbucket-server/" class="wp_rp_title">Drone CI Server 搭配 Atlassian Bitbucket Server (前身 Stash)</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-6739" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/how-to-schedule-builds-in-drone/" class="wp_rp_title">Cronjob 搭配 Drone 服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6786" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/2017-coscup-introduction-to-gitea-drone/" class="wp_rp_title">2017 COSCUP 研討會: Gitea + Drone 介紹</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-6804" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/why-i-choose-drone-as-ci-cd-tool/" class="wp_rp_title">為什麼我用 Drone 取代 Jenkins 及 GitLab CI</a><small class="wp_rp_comments_count"> (10)</small><br /></li></ul></div></div>