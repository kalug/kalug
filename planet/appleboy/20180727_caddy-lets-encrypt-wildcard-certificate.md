---
title: "用 Caddy 申請 Let’s Encrypt Wildcard 憑證"
date: 2018-07-27
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/07/caddy-lets-encrypt-wildcard-certificate/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/42761134805/in/dateposted-public/" title="Screen Shot 2018-07-27 at 11.29.44 AM"><img src="https://i2.wp.com/farm1.staticflickr.com/846/42761134805_c4ab2e9168_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-07-27 at 11.29.44 AM" data-recalc-dims="1" /></a>

2018 年 3 月 <a href="https://letsencrypt.org/">Let&#8217;s Encrypt</a> 官方正式公告<a href="https://community.letsencrypt.org/t/acme-v2-production-environment-wildcards/55578">支援 Wildcard Certificate 憑證</a>，有在玩多個 subdomain 有福了，未來只要申請一張 <code>*.example.com</code> 就全部通用啦，當然很高興 <a href="https://caddyserver.com/">Caddy</a> 也跟進了，在 <a href="https://caddyserver.com/blog/caddy-0_11-released">v11.0</a> 正式支援多種 DNS Provider，只要申請 DNS 提供商的 API Key 或 Secret 設定在啟動 Caddy 步驟內就可以了。底下用 <a href="https://tw.godaddy.com/">Godaddy</a> 舉例。

<span id="more-7054"></span>

<h2>申請 Godaddy API Key</h2>

請直接上 <a href="https://developer.godaddy.com/keys">Godaddy 開發者網站</a>申請，就可以正式拿到 Key 跟 Secret

<a href="https://www.flickr.com/photos/appleboy/43663781331/in/dateposted-public/" title="https___developer_godaddy_com_keys__&#x1f50a;"><img src="https://i0.wp.com/farm1.staticflickr.com/922/43663781331_ea6b26d29a_z.jpg?w=840&#038;ssl=1" alt="https___developer_godaddy_com_keys__&#x1f50a;" data-recalc-dims="1" /></a>

<h2>下載 Caddy 執行檔</h2>

可以直接到<a href="https://caddyserver.com/download">官方網站</a>下載，請記得選擇您的 DNS Provider plugin 才可以

<a href="https://www.flickr.com/photos/appleboy/43617522682/in/dateposted-public/" title="Download_Caddy_&#x1f50a;"><img src="https://i0.wp.com/farm1.staticflickr.com/837/43617522682_96e20797cd_z.jpg?w=840&#038;ssl=1" alt="Download_Caddy_&#x1f50a;" data-recalc-dims="1" /></a>

接著點選左下角的 Download 按鈕，下方會顯示可以透過 CURL 方式來安裝

<pre class="brush: plain; title: ; notranslate">
$ curl https://getcaddy.com | bash -s personal http.cache,http.expires,tls.dns.godaddy
</pre>

直接把上面的指令貼到 Linux Console 上，這樣系統會預設將 Caddy 安裝到 <code>/usr/local/bin</code> 底下。

<h2>Caddy 設定檔並啟動</h2>

打開您的 <code>Caddyfile</code> 或者是其他檔案。裡面寫入

<pre class="brush: plain; title: ; notranslate">
*.design.wu-boy.com {
    proxy / localhost:8081 {
        websocket
    }

    tls {
        dns godaddy
    }
}
</pre>

請注意 dns 區域，請填上 DNS Provider，如果不知道要填什麼值，可以參考<a href="https://caddyserver.com/docs/automatic-https">線上文件</a>，完成後可以透過底下指令啟動:

<pre class="brush: plain; title: ; notranslate">
$ GODADDY_API_KEY=xxxx \
GODADDY_API_SECRET=xxxx \
CADDYPATH=/etc/caddy/ssl \
caddy -conf=/etc/caddy/Caddyfile
</pre>

啟動後，可以打開網頁測試看看

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/appleboy/29794179438/in/dateposted-public/" title="Screenshot_2018_7_27__11_25_AM"><img src="https://i1.wp.com/farm1.staticflickr.com/914/29794179438_c3c1bf80a3_z.jpg?resize=640%2C292&#038;ssl=1" alt="Screenshot_2018_7_27__11_25_AM" data-recalc-dims="1"></a>
<div class="wp_rp_wrap  wp_rp_plain" id="wp_rp_first"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6777" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/lets-encrypt-support-wildcard-certificates-in-2018-01/" class="wp_rp_title">Let&#8217;s Encrypt 將在 2018 年一月支援 Wildcard Certificates</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-5958" data-post-type="none" ><a href="https://blog.wu-boy.com/2015/12/letsencrypt-entering-public-beta-free-ssl/" class="wp_rp_title">Letsencrypt 開放申請免費 SSL 憑證</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="2" data-poid="in-6072" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/01/free-register-letsencrypt-ssl-website/" class="wp_rp_title">免費幫您申請 Letsencrypt 憑證網站</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-5967" data-post-type="none" ><a href="https://blog.wu-boy.com/2015/12/force-https-connection-on-wordpress/" class="wp_rp_title">將 wordpress 強制使用 SSL 連線</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6899" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/migrate-nginx-to-caddy/" class="wp_rp_title">從 Nginx 換到 Caddy</a><small class="wp_rp_comments_count"> (7)</small><br /></li><li data-position="5" data-poid="in-6683" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/1-line-letsencrypt-https-servers-in-golang/" class="wp_rp_title">在 Go 語言用一行程式碼自動化安裝且更新 Let’s Encrypt 憑證</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="6" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6548" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/10/website-support-http2-using-letsencrypt/" class="wp_rp_title">申請 Let&#8217;s Encrypt 免費憑證讓網站支援 HTTP2</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="8" data-poid="in-5273" data-post-type="none" ><a href="https://blog.wu-boy.com/2014/04/startssl-close-registeration-openssl-cve-2014-0160-heartbleed-security/" class="wp_rp_title">StartSSL 關閉註冊 OpenSSL CVE-2014-0160 Heartbleed Security</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="9" data-poid="in-6481" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/golang-tesing-on-jenkins/" class="wp_rp_title">在 Jenkins 跑 Golang 測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>