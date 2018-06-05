---
title: "用 Nginx 來架設線上即時縮圖機"
date: 2018-03-17
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/03/nginx-reverse-proxy-image-resizing/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/26946324088/in/dateposted-public/" title="Screen Shot 2018-03-15 at 10.21.38 AM"><img src="https://i0.wp.com/farm1.staticflickr.com/790/26946324088_93725a917b_z.jpg?w=840&#038;ssl=1" alt="Screen Shot 2018-03-15 at 10.21.38 AM" data-recalc-dims="1" /></a>

在更早以前我們怎麼實現縮圖機制，當使用者上傳一張檔案，後端會固定將圖片縮圖成各種前端網頁需要的大小，不管前端頁面是否有使用，後端都會先產生好，這有什麼缺陷？

<ol>
<li>佔用硬碟空間大小</li>
<li>前端又需要另外一種格式的縮圖?</li>
</ol>

第二個問題比較麻煩，當前端需要另一種縮圖格式，後端就要開始掃描系統的全部圖片，再重新產生一次。非常耗費後端系統效能。後來才改成透過 URL 定義長寬來決定即時縮圖，在 <a href="https://golang.org">Go 語言</a>內可以選擇使用 <a href="https://github.com/thoas/picfit">picfit</a> 來當作後端即時的縮圖機。本篇則是要提供另一種解法，就是使用 <a href="http://nginx.org">Nginx</a> 搭配 <a href="http://nginx.org/en/docs/http/ngx_http_image_filter_module.html">image_filter</a> 外掛來達成即時縮圖機制。

<span id="more-6977"></span>

<h2>使用 image_filter</h2>

來看看縮圖網址

<pre class="brush: plain; title: ; notranslate">
http://foobar.org/image_width/bucket_name/image_name
</pre>

<ul>
<li><strong>image_width</strong>: 圖片 width</li>
<li><strong>bucket_name</strong>: 圖片目錄或 AWS S3 bucket</li>
<li><strong>image_width</strong>: 圖片檔名</li>
</ul>

其中 bucket 可以是 <a href="https://aws.amazon.com/tw/s3/">AWS S3</a>。底下是 Nginx 的簡單設定:

<pre class="brush: plain; title: ; notranslate">
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name ${NGINX_HOST};

  location ~ ^/([0-9]+)/(.*)$ {
    set $width $1;
    set $path $2;
    rewrite ^ /$path break;
    proxy_pass ${IMAGE_HOST};
    image_filter resize $width -;
    image_filter_buffer 100M;
    image_filter_jpeg_quality ${JPG_QUALITY};
    expires ${EXPIRE_TIME};
  }
}
</pre>

我們可以設定 expires 來讓使用這存在瀏覽器端，這樣下次瀏覽網頁的時候都可以使用快取機制。可以看到 <code>IMAGE_HOST</code> 可以是 AWS S3 URL。

<ol>
<li>先從 <code>IMAGE_HOST</code> 下載圖片</li>
<li>Nginx 執行縮圖</li>
<li>儲存圖片在使用者 browser 端</li>
</ol>

<a href="https://www.flickr.com/photos/appleboy/40809061222/in/dateposted-public/" title="Snip20180317_2"><img src="https://i1.wp.com/farm1.staticflickr.com/817/40809061222_088e694426_z.jpg?w=840&#038;ssl=1" alt="Snip20180317_2" data-recalc-dims="1" /></a>

到這邊會有個問題，假設有一萬個使用者在不同的地方同時連線，Nginx 就需要處理 1 萬次，可以直接用 <a href="https://github.com/tsenart/vegeta">vegeta</a> 來 Benchmark 試試看

<pre class="brush: plain; title: ; notranslate">
$ echo &quot;GET http://localhost:8002/310/test/26946324088_5b3f0b1464_o.png&quot; | vegeta attack -rate=100 -connections=1 -duration=1s | tee results.bin | vegeta report
Requests      [total, rate]            100, 101.01
Duration      [total, attack, wait]    8.258454731s, 989.999ms, 7.268455731s
Latencies     [mean, 50, 95, 99, max]  3.937031678s, 4.079690985s, 6.958110121s, 7.205018428s, 7.268455731s
Bytes In      [total, mean]            4455500, 44555.00
Bytes Out     [total, mean]            0, 0.00
Success       [ratio]                  100.00%
Status Codes  [code:count]             200:100
Error Set:
</pre>

上面數據顯示每秒打 100 次連線，ngix 需要花費 8 秒多才能執行結束。而延遲時間也高達 3 秒多。

<h2>加入 proxy cache 機制</h2>

透過 proxy cache 機制可以讓 nginx 只產生一次縮圖，並且放到 cache 目錄內可以減少短時間的不同連線。但是 image_filter 無法跟 proxy cache 同時處理，所以必須要拆成兩個 host 才可以達到此目的，如果沒有透過 proxy cache，你也可以用 <a href="https://www.cloudflare.com/cdn/">cloudflare CDN</a> 來達成此目的。請參考<a href="https://github.com/appleboy/nginx-image-resizer/blob/ab1e460de8774eccc4cae06a5c7e37536899126e/default.conf#L1-L44">線上設定</a>

<pre class="brush: plain; title: ; notranslate">
proxy_cache_path /data keys_zone=cache_zone:10m;

server {
  # Internal image resizing server.
  server_name localhost;
  listen 8888;

  # Clean up the headers going to and from S3.
  proxy_hide_header &quot;x-amz-id-2&quot;;
  proxy_hide_header &quot;x-amz-request-id&quot;;
  proxy_hide_header &quot;x-amz-storage-class&quot;;
  proxy_hide_header &quot;Set-Cookie&quot;;
  proxy_ignore_headers &quot;Set-Cookie&quot;;

  location ~ ^/([0-9]+)/(.*)$ {
    set $width $1;
    set $path $2;
    rewrite ^ /$path break;
    proxy_pass ${IMAGE_HOST};
    image_filter resize $width -;
    image_filter_buffer 100M;
    image_filter_jpeg_quality ${JPG_QUALITY};
  }
}


server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name ${NGINX_HOST};

  location ~ ^/([0-9]+)/(.*)$ {
    set $width $1;
    set $path $2;
    rewrite ^ /$path break;
    proxy_pass http://127.0.0.1:8888/$width/$path;
    proxy_cache cache_zone;
    proxy_cache_key $uri;
    proxy_cache_valid 200 302 24h;
    proxy_cache_valid 404 1m;
    # expire time for browser
    expires ${EXPIRE_TIME};
  }
}
</pre>

<h2>測試數據</h2>

這邊使用 <a href="https://minio.io/">minio</a> 來當作 S3 儲存空間，再搭配 Nginx 1.3.9 版本來測試上面設定效能。底下是 <a href="https://docs.docker.com/compose/">docker-compose</a> 一鍵啟動

<pre class="brush: plain; title: ; notranslate">
version: &#039;2&#039;

services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - &quot;9000:9000&quot;
    volumes:
      - minio-data:/data
    environment:
      MINIO_ACCESS_KEY: YOUR_MINIO_ACCESS_KEY
      MINIO_SECRET_KEY: YOUR_MINIO_SECRET_KEY
    command: server /data

  image-resizer:
    image: appleboy/nginx-image-resizer
    container_name: image-resizer
    ports:
      - &quot;8002:80&quot;
    environment:
      IMAGE_HOST: http://minio:9000
      NGINX_HOST: localhost

volumes:
  minio-data:
</pre>

用 docker-compose up 可以將 nginx 及 minio 服務同時啟動，接著打開 http://localhost:9000 上傳圖片，再透過 <a href="https://github.com/tsenart/vegeta">vegeta</a> 測試數據:

<pre class="brush: plain; title: ; notranslate">
$ echo &quot;GET http://localhost:8002/310/test/26946324088_5b3f0b1464_o.png&quot; | vegeta attack -rate=100 -connections=1 -duration=1s | tee results.bin | vegeta report
Requests      [total, rate]            100, 101.01
Duration      [total, attack, wait]    993.312255ms, 989.998ms, 3.314255ms
Latencies     [mean, 50, 95, 99, max]  3.717219ms, 3.05486ms, 8.891027ms, 12.488937ms, 12.520428ms
Bytes In      [total, mean]            4455500, 44555.00
Bytes Out     [total, mean]            0, 0.00
Success       [ratio]                  100.00%
Status Codes  [code:count]             200:100
Error Set:
</pre>

執行時間變成 <code>993.312255ms</code>，Latency 也降到 <code>3.717219ms</code>，效能提升了很多。透過簡單的 <a href="https://www.docker.com">docker</a> 指令就可以在任意機器架設此縮圖機。詳細步驟請參考 <a href="https://github.com/appleboy/nginx-image-resizer">nginx-image-resizer</a>

<pre class="brush: plain; title: ; notranslate">
$ docker run -e NGINX_PORT=8081 \
  -e NGINX_HOST=localhost \
  -e IMAGE_HOST=&quot;http://localhost:9000&quot; \
  appleboy/nginx-image-resizer
</pre>

<h1>程式碼請參考 <a href="https://github.com/appleboy/nginx-image-resizer">nginx-image-resizer</a></h1>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-3691" data-post-type="none" ><a href="https://blog.wu-boy.com/2012/11/nginx-check-if-file-exists/" class="wp_rp_title">Nginx 判斷檔案是否存在</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-4234" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/06/force-phpmyadmin-ssl-with-nginx/" class="wp_rp_title">Nginx + phpMyAdmin 搭配 SSL 設定</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="2" data-poid="in-5402" data-post-type="none" ><a href="https://blog.wu-boy.com/2014/06/ngnix-php5-fpm-sock-failed-permission-denied/" class="wp_rp_title">Ngnix 搭配 PHP-FPM 噴 php5-fpm.sock failed (13: Permission denied)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-6899" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/migrate-nginx-to-caddy/" class="wp_rp_title">從 Nginx 換到 Caddy</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="4" data-poid="in-6683" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/1-line-letsencrypt-https-servers-in-golang/" class="wp_rp_title">在 Go 語言用一行程式碼自動化安裝且更新 Let’s Encrypt 憑證</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-3496" data-post-type="none" ><a href="https://blog.wu-boy.com/2012/05/php-fastcgi-with-nginx-on-ubuntu-10-10-maverick/" class="wp_rp_title">在 Ubuntu 10.10 (Maverick) 架設 Nginx + PHP FastCGI</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="6" data-poid="in-4698" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/11/jenkins-nginx-auth/" class="wp_rp_title">Jenkins + Nginx User Auth</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="7" data-poid="in-6548" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/10/website-support-http2-using-letsencrypt/" class="wp_rp_title">申請 Let&#8217;s Encrypt 免費憑證讓網站支援 HTTP2</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="8" data-poid="in-4179" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/04/install-nginx-spdy-module-on-ubuntu-or-debian/" class="wp_rp_title">Install Nginx + spdy module on Ubuntu or Debian</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-4157" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/04/nginx-1-4-0-support-spdy-module/" class="wp_rp_title">nginx 1.4.0 釋出並支援 SPDY</a><small class="wp_rp_comments_count"> (4)</small><br /></li></ul></div></div>