---
title: "Minio 從 Docker 容器移除 healthcheck 腳本"
date: 2019-08-18
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2019/08/minio-remove-healthcheck-script-for-docker-image/
layout: post
comments: true
---

<p><a href="https://lh3.googleusercontent.com/3lAv9HlhI9mxCfow0jHY5-G6H-tvXJLCv3S2QvzKReV_R-61oywRIXW6sruwPrS69CXpMAuIrccgVH8HY5hIzDGvenyhFhKcGmBk0CmU1c36k6NrjSvYESSmAEAejlxmxdW_gduXZio=w1920-h1080" title="minio golang"><img src="https://lh3.googleusercontent.com/3lAv9HlhI9mxCfow0jHY5-G6H-tvXJLCv3S2QvzKReV_R-61oywRIXW6sruwPrS69CXpMAuIrccgVH8HY5hIzDGvenyhFhKcGmBk0CmU1c36k6NrjSvYESSmAEAejlxmxdW_gduXZio=w1920-h1080" alt="minio golang" title="minio golang" /></a></p>
<p><a href="https://min.io/">Minio</a> 是一套開源專案的 Object 儲存容器，如果你有使用 <a href="https://aws.amazon.com/tw/s3/">AWS S3</a>，相信要找一套代替 S3 的替代品，一定會想到這套用 <a href="https://golang.org">Go 語言</a>開發的 Minio 專案。讓您在公司內部也可以享有 S3 的儲存容器，不需要變動任何程式碼就可以無痛從 AWS S3 搬到公司內部。剛好最近在整合 Traefik 搭配 Minio，由於 Minio 原先已經內建 healthcheck 腳本，所以當運行 Minio 時，使用 <code>docker ps</code> 正常來說可以看到類似 <code>Up 7 weeks (healthy)</code> 字眼，但是 Minio 運行了三分鐘之後，狀態就會從 <code>healthy</code> 變成 <code>unhealthy</code>，造成 Traefik 會自動移除 frontend 的對應設定，這樣 Web 就無法顯示了。我在 Udemy 上面有介紹如<a href="https://www.udemy.com/course/golang-fight/learn/lecture/9962004#overview">何用 Golang 寫 healthcheck</a>，大家有興趣可以參考看看，coupon code 可以輸入 <strong>GOLANG2019 </strong>。</p>
<span id="more-7441"></span>
<h2>官方移除 healthcheck 腳本</h2>
<p>我在官方發了一個 <a href="https://github.com/minio/minio/issues/8082">Issue</a>，發現大家 workaround 的方式就是自己移除 healthcheck 檢查，然後再自行發布到 DockerHub，這方法也是可行啦，只是這樣還要自己去更新版本有點麻煩，後來官方直接<a href="https://github.com/minio/minio/pull/8095">發個 PR</a> 把整段 Healthcheck 腳本移除，官方說法是說，容器那大家的設定的執行 User 或權限都不同，所以造成無法讀取 netstat 資料，所以直接移除，用大家熟悉的 curl 方式來執行，在 kubernets 內可以使用</p>
<pre><code class="language-yaml">healthcheck:
  image: minio/minio:RELEASE.2019-08-14T20-37-41Z
      test: [&quot;CMD&quot;, &quot;curl&quot;, &quot;-f&quot;, &quot;http://minio1:9000/minio/health/live&quot;]
  volumes:
      interval: 1m30s
   - data2:/data
      timeout: 20s
  ports:
      retries: 3
   - &quot;9002:9000&quot;
      start_period: 3m</code></pre>
<h2>自行開發 healthcheck</h2>
<p>如果你有看之前 minio 程式碼，可以發現寫得相當複雜，通常預設只要 ping 通 web 服務就可以了</p>
<pre><code class="language-go">resp, err := http.Get(&quot;http://localhost&quot; + config.Server.Addr + &quot;/healthz&quot;)
if err != nil {
  log.Error().
    Err(err).
    Msg(&quot;failed to request health check&quot;)
  return err
}
defer resp.Body.Close()
if resp.StatusCode != http.StatusOK {
  log.Error().
    Int(&quot;code&quot;, resp.StatusCode).
    Msg(&quot;health seems to be in bad state&quot;)
  return fmt.Errorf(&quot;server returned non-200 status code&quot;)
}
return nil</code></pre>
<p>接著在 Dockerfile 裡面寫入底下，就大功告成啦。</p>
<pre><code class="language-dockerfile">HEALTHCHECK --start-period=2s --interval=10s --timeout=5s \
  CMD [&quot;/bin/crosspoint-server&quot;, &quot;health&quot;]</code></pre>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7352" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/04/install-specific-go-version-in-appveyor/" class="wp_rp_title">在 appveyor 內指定 Go 語言編譯版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-7405" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/07/speed-up-go-module-download-using-go-proxy-athens/" class="wp_rp_title">架設 Go Proxy 服務加速 go module 下載速度</a><small class="wp_rp_comments_count"> (7)</small><br /></li><li data-position="3" data-poid="in-7193" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/01/deploy-service-using-traefik-and-docker/" class="wp_rp_title">用 Traefik 搭配 Docker 快速架設服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-7047" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/mkcert-zero-config-tool-to-make-locally-trusted-development-certificates/" class="wp_rp_title">在本機端快速產生網站免費憑證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6877" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/grpc-health-check-in-go/" class="wp_rp_title">Go 語言實現 gRPC Health 驗證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6714" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/" class="wp_rp_title">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="7" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="8" data-poid="in-7452" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/08/golang-project-layout-and-practice/" class="wp_rp_title">Go 語言目錄結構與實踐</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-7250" data-post-type="none" ><a href="https://blog.wu-boy.com/2019/02/deploy-golang-app-to-heroku/" class="wp_rp_title">快速部署網站到 Heroku 雲平台</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>