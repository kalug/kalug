---
title: "在本機端快速產生網站免費憑證"
date: 2018-07-06
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/07/mkcert-zero-config-tool-to-make-locally-trusted-development-certificates/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/43227213371/in/dateposted-public/" title="SSL-Certificate"><img src="https://i1.wp.com/farm2.staticflickr.com/1785/43227213371_a041db0810_o.png?w=840&#038;ssl=1" alt="SSL-Certificate" data-recalc-dims="1" /></a>

大家看到網站免費憑證，一定會想到 <a href="https://letsencrypt.org/">Let&#8217;s encrypt</a> 服務商提供一個網域可以使用 100 個免費憑證，如果您有很多 subdomain 需求，還可以申請獨立一張 <a href="https://community.letsencrypt.org/t/acme-v2-and-wildcard-certificate-support-is-live/55579">wildcard 憑證</a>，但是這是在伺服器端的操作，假設在本機端開發，該如何快速產生憑證，這樣開啟瀏覽器時，就可以看到綠色的 https 字眼

<a href="https://www.flickr.com/photos/appleboy/43177490822/in/dateposted-public/" title="Snip20180706_2"><img src="https://i2.wp.com/farm1.staticflickr.com/921/43177490822_974612c015_z.jpg?w=840&#038;ssl=1" alt="Snip20180706_2" data-recalc-dims="1" /></a>

<span id="more-7047"></span>

<h2>安裝 mkcert</h2>

本篇介紹一個用 <a href="https://golang.org">Go 語言</a>寫的工具叫做 <a href="https://github.com/FiloSottile/mkcert">mkcert</a>，此工具目前只有支援 MacOS 及 Linux 環境，未來會支援 Windows，如果有在玩 Windows 的開發者，也可以直接開 PR 啦。安裝方式非常簡單。在 MacOS 可以用 brew

<pre class="brush: plain; title: ; notranslate">
$ brew install mkcert
$ brew install nss # if you use Firefox
</pre>

<h2>使用 mkcert</h2>

第一步驟就是先初始化目錄

<pre class="brush: plain; title: ; notranslate">
$ mkcert -install
</pre>

接著看看有幾個網站 domain 需要在本機端使用可以一次申請

<pre class="brush: plain; title: ; notranslate">
$ mkcert myapp.dev example.com
Using the local CA at &quot;/Users/xxxxxx/Library/Application Support/mkcert&quot; ✨

Created a new certificate valid for the following names <img src="https://s.w.org/images/core/emoji/2.3/72x72/1f4dc.png" alt="📜" class="wp-smiley" style="height: 1em; max-height: 1em;" />
 - &quot;example.com&quot;
 - &quot;myapp.dev&quot;

The certificate is at &quot;./example.com+1.pem&quot; and the key at &quot;./example.com+1-key.pem&quot; ✅
</pre>

<h2>撰寫簡單 https 服務</h2>

這邊用 Go 語言當例子

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;log&quot;
    &quot;net/http&quot;
)

func helloServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set(&quot;Content-Type&quot;, &quot;text/plain&quot;)
    w.Write([]byte(&quot;This is an example server.\n&quot;))
}

func main() {
    log.Println(&quot;Server listen in 443 port. Please open https://localhost/hello&quot;)
    http.HandleFunc(&quot;/hello&quot;, helloServer)
    err := http.ListenAndServeTLS(&quot;:443&quot;, &quot;ssl/localhost.pem&quot;, &quot;ssl/localhost-key.pem&quot;, nil)
    if err != nil {
        log.Fatal(&quot;ListenAndServe: &quot;, err)
    }
}
</pre>

其中 <code>ssl/localhost.pem</code> 跟 <code>ssl/localhost-key.pem</code> 就是剛剛透過 mkcert 產生出來的金鑰。透過 curl 工具，可以快速驗證是否成功:

<pre class="brush: plain; title: ; notranslate">
$ curl -v https://localhost/hello
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use h2
* Server certificate:
*  subject: O=mkcert development certificate
*  start date: Jul  5 02:06:09 2018 GMT
*  expire date: Jul  6 02:06:09 2028 GMT
*  subjectAltName: host &quot;localhost&quot; matched cert&#039;s &quot;localhost&quot;
*  issuer: O=mkcert development CA
*  SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x7f8fca805800)
&gt; GET /hello HTTP/2
&gt; Host: localhost
&gt; User-Agent: curl/7.54.0
&gt; Accept: */*
&gt;
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
&lt; HTTP/2 200
&lt; content-type: text/plain
&lt; content-length: 27
&lt; date: Fri, 06 Jul 2018 02:30:54 GMT
&lt;
This is an example server.
* Connection #0 to host localhost left intact
</pre>

上面範例放在 <a href="https://github.com/go-training/training/tree/master/example21-simple-golang-https-tls">go-training 專案</a>內，歡迎大家取用。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-6634" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/01/new-git-code-hosting-option-gitea/" class="wp_rp_title">開發者另類的自架 Git 服務選擇: Gitea</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="3" data-poid="in-6481" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/golang-tesing-on-jenkins/" class="wp_rp_title">在 Jenkins 跑 Golang 測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6683" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/1-line-letsencrypt-https-servers-in-golang/" class="wp_rp_title">在 Go 語言用一行程式碼自動化安裝且更新 Let’s Encrypt 憑證</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-6819" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/" class="wp_rp_title">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7021" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/" class="wp_rp_title">如何在 Go 專案內寫測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6569" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/" class="wp_rp_title">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="8" data-poid="in-6617" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/12/send-line-message-using-drone-line/" class="wp_rp_title">用 drone-line 架設 Line webhook 及發送訊息</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li></ul></div></div>