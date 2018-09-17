---
title: "在 PostgreSQL 時區轉換及計算時間"
date: 2018-09-02
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/09/converting-timestamp-to-timestamp-in-a-specific-time-zone-in-postgres/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/29481716727/in/dateposted-public/" title="2000px-Postgresql_elephant.svg"><img src="https://i0.wp.com/farm2.staticflickr.com/1858/29481716727_5872d14945.jpg?w=840&#038;ssl=1" alt="2000px-Postgresql_elephant.svg" data-recalc-dims="1" /></a>

通常在使用資料表時，都會在每一筆紀錄上面寫入當下時間，而這個時間會根據目前系統所在的時區而有所不同，當然我們都會使用 <code>UTC+0</code> 作為標準時區，而欄位我們則會是使用 timestamp 或者是 unix time 格式，兩者最大的差異就是在前者 (timestamp) 會根據目前系統的時區來記錄，而後者 (unix time) 則是紀錄秒數差異 (Jan 01 1970) 而不會隨著系統時區改變而變化。如果是發展開源專案，則會使用後者居多，這樣不會因為使用者時區變化，而產生不同的差異，在 <a href="https://gitea.io">Gitea 開源專案</a>保留了兩者，但是只要計算時間則是用 (unix time) 作轉換。

<span id="more-7076"></span>

<h2>計算時區問題</h2>

針對底下兩個問題來看看該如何在 <a href="https://www.postgresql.org/">PostgreSQL</a> 內計算時區，首先我們先定義在系統存放的時間都是統一 <code>UTC+0</code> 時區，而使用者查詢時的瀏覽器為台灣時間 <code>Asia/Taipei</code> 時區為 <code>UTC+08:00</code>，底下是第一個問題

<blockquote>
  查詢條件為當下時間過去 24 小時的全部紀錄
</blockquote>

也就是說現在時間為 <code>2018-09-02 15:00</code> 那就是請抓取 <code>2018-09-01 15:00</code> 到 <code>2018-09-02 15:00</code> 區間內所有記錄，這個問題其實不難，跟時區也沒有任何關係，不管系統是存 UTC+0 或 UTC+8 都不影響。只要我們抓 <code>now()</code> 往前推算 24 小時即可。假設資料表有一個欄位為 <code>created_at</code> 存的是 timestamp 格式。底下就是解法:

<pre class="brush: plain; title: ; notranslate">
select title, desc from users \
  where created_at &gt; now() - interval &#039;1 day&#039;
</pre>

其中 <code>now() - interval '1 day'</code> 代表著現在時間去減掉 1 天的時間。這邊沒有時區的問題，假設另一個問題如下:

<blockquote>
  請查詢過去 7 天的記錄 (含當下當天資料)
</blockquote>

假設現在時間為 2018-09-02 16:00+08:00 (台灣時間星期天)，這時候我們預設的查詢時間範圍會是 <code>2018-08-27 00:00+0800</code> 到 <code>2018-09-02 16:00+08:00</code> 時間區間內所有資料，底下是目前資料庫的資料:

<table>
<thead>
<tr>
  <th>id</th>
  <th>created_at (utc+0)</th>
</tr>
</thead>
<tbody>
<tr>
  <td>1231</td>
  <td>2018-08-26 18:25:35.624</td>
</tr>
<tr>
  <td>1225</td>
  <td>2018-08-26 19:15:19.187</td>
</tr>
<tr>
  <td>1220</td>
  <td>2018-08-27 04:24:59.306</td>
</tr>
<tr>
  <td>1222</td>
  <td>2018-08-27 05:38:57.174</td>
</tr>
<tr>
  <td>1230</td>
  <td>2018-08-27 07:21:35.897</td>
</tr>
<tr>
  <td>1239</td>
  <td>2018-08-28 07:37:52.345</td>
</tr>
<tr>
  <td>1264</td>
  <td>2018-08-30 05:21:17.157</td>
</tr>
<tr>
  <td>1290</td>
  <td>2018-08-31 12:05:04.764</td>
</tr>
<tr>
  <td>1356</td>
  <td>2018-08-31 20:51:29.784</td>
</tr>
<tr>
  <td>1358</td>
  <td>2018-09-01 12:14:13.118</td>
</tr>
<tr>
  <td>1355</td>
  <td>2018-09-01 19:21:36.482</td>
</tr>
<tr>
  <td>1354</td>
  <td>2018-09-02 03:18:38.626</td>
</tr>
<tr>
  <td>1361</td>
  <td>2018-09-02 03:37:05.171</td>
</tr>
</tbody>
</table>

這時候使用上面的解法試試看:

<pre class="brush: plain; title: ; notranslate">
where created_at  &gt; now() - interval &#039;6 day&#039;
</pre>

拿到底下資料

<table>
<thead>
<tr>
  <th>id</th>
  <th>created_at (utc+0)</th>
</tr>
</thead>
<tbody>
<tr>
  <td>1239</td>
  <td>2018-08-28 07:37:52.345</td>
</tr>
<tr>
  <td>1264</td>
  <td>2018-08-30 05:21:17.157</td>
</tr>
<tr>
  <td>1290</td>
  <td>2018-08-31 12:05:04.764</td>
</tr>
<tr>
  <td>1356</td>
  <td>2018-08-31 20:51:29.784</td>
</tr>
<tr>
  <td>1358</td>
  <td>2018-09-01 12:14:13.118</td>
</tr>
<tr>
  <td>1355</td>
  <td>2018-09-01 19:21:36.482</td>
</tr>
<tr>
  <td>1354</td>
  <td>2018-09-02 03:18:38.626</td>
</tr>
<tr>
  <td>1361</td>
  <td>2018-09-02 03:37:05.171</td>
</tr>
</tbody>
</table>

這時候你會發，怎麼 27 號的資料都沒有進來呢？原因出在 <code>now() - interval '6 day'</code> 計算出來的結果會是讀取時間大於 <code>2018-08-27 16:00+08:00</code>，那換算 UTC 時間則為 <code>2018-08-27 08:00+00:00</code>，這樣是不對的，那 8/27 該天的 00:00 ~ 08:00 的時間也沒被算進去，這時候需要時間的轉換

<pre class="brush: plain; title: ; notranslate">
where created_at  &gt; (now() - interval &#039;6 day&#039;)::date
</pre>

<code>(now() - interval '6 day')::date</code> 就可以把時間調整為當天 00:00 開始計算。這樣我們找出來的資料便是:

<table>
<thead>
<tr>
  <th>id</th>
  <th>created_at (utc+0)</th>
</tr>
</thead>
<tbody>
<tr>
  <td>1220</td>
  <td>2018-08-27 04:24:59.306</td>
</tr>
<tr>
  <td>1222</td>
  <td>2018-08-27 05:38:57.174</td>
</tr>
<tr>
  <td>1230</td>
  <td>2018-08-27 07:21:35.897</td>
</tr>
<tr>
  <td>1239</td>
  <td>2018-08-28 07:37:52.345</td>
</tr>
<tr>
  <td>1264</td>
  <td>2018-08-30 05:21:17.157</td>
</tr>
<tr>
  <td>1290</td>
  <td>2018-08-31 12:05:04.764</td>
</tr>
<tr>
  <td>1356</td>
  <td>2018-08-31 20:51:29.784</td>
</tr>
<tr>
  <td>1358</td>
  <td>2018-09-01 12:14:13.118</td>
</tr>
<tr>
  <td>1355</td>
  <td>2018-09-01 19:21:36.482</td>
</tr>
<tr>
  <td>1354</td>
  <td>2018-09-02 03:18:38.626</td>
</tr>
<tr>
  <td>1361</td>
  <td>2018-09-02 03:37:05.171</td>
</tr>
</tbody>
</table>

可以正確抓到 2018-08-27 的資料，但是看到這邊是不是又覺得怪怪的，最前面兩筆應該也要被算進來，我們先把上面的時區全部 +08:00

<pre class="brush: plain; title: ; notranslate">
select created_at, \
  created_at at time zone &#039;UTC&#039; at time zone &#039;Asia/Taipei&#039;
</pre>

<table>
<thead>
<tr>
  <th>created_at (utc+0)</th>
  <th>created_at (utc+8)</th>
</tr>
</thead>
<tbody>
<tr>
  <td>2018-08-26 18:25:35.624</td>
  <td>2018-08-27 02:25:35.624</td>
</tr>
<tr>
  <td>2018-08-26 19:15:19.187</td>
  <td>2018-08-27 03:15:19.187</td>
</tr>
<tr>
  <td>2018-08-27 04:24:59.306</td>
  <td>2018-08-27 12:24:59.306</td>
</tr>
<tr>
  <td>2018-08-27 05:38:57.174</td>
  <td>2018-08-27 13:38:57.174</td>
</tr>
<tr>
  <td>2018-08-27 07:21:35.897</td>
  <td>2018-08-27 15:21:35.897</td>
</tr>
<tr>
  <td>2018-08-28 07:37:52.345</td>
  <td>2018-08-28 15:37:52.345</td>
</tr>
<tr>
  <td>2018-08-30 05:21:17.157</td>
  <td>2018-08-30 13:21:17.157</td>
</tr>
<tr>
  <td>2018-08-31 12:05:04.764</td>
  <td>2018-08-31 20:05:04.764</td>
</tr>
<tr>
  <td>2018-08-31 20:51:29.784</td>
  <td>2018-09-01 04:51:29.784</td>
</tr>
<tr>
  <td>2018-09-01 12:14:13.118</td>
  <td>2018-09-01 20:14:13.118</td>
</tr>
<tr>
  <td>2018-09-01 19:21:36.482</td>
  <td>2018-09-02 03:21:36.482</td>
</tr>
<tr>
  <td>2018-09-02 03:18:38.626</td>
  <td>2018-09-02 11:18:38.626</td>
</tr>
<tr>
  <td>2018-09-02 03:37:05.171</td>
  <td>2018-09-02 11:37:05.171</td>
</tr>
</tbody>
</table>

有沒有發現第一筆跟第二筆，在台灣時間是在 08-27 號，所以理論上應該要是我們的查詢範圍之間，但是沒有被查到。解決方式就是將欄位都先轉成使用者時區再去做計算

<pre class="brush: plain; title: ; notranslate">
created_at at time zone &#039;utc&#039; time zone &#039;Asia/Taipei&#039; &gt; \
 (now() at time zone &#039;Asia/Taipei1&#039; - interval &#039;6 day&#039;)::date
</pre>

其中關鍵點就在把 <code>created_at</code> 先轉 utc+0 再轉 utc+8 最後才做比較。

<h2>後記</h2>

使用者時區會隨在手機的所在地點做轉換，所以這邊的最好的作法就是，在資料庫統一存放 UTC+0 的時區，接著在 App 端登入帳號時，將使用者時區字串帶入到 Token 內，這樣使用者從台灣飛到美國時，登入 App 就能即時看到美國時區的資料。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6396" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/06/server-monitoring-mysql-postgres-daemon-in-docker/" class="wp_rp_title">在 Docker 偵測 MySQL 或 Postgres 是否啟動</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-4779" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/12/increase-phpmyadmin-login-time/" class="wp_rp_title">增加 phpMyAdmin 登入時間</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-131" data-post-type="none" ><a href="https://blog.wu-boy.com/2007/12/mysql-%e5%bf%98%e8%a8%98-root-%e5%af%86%e7%a2%bc%ef%bc%8c%e7%99%bb%e4%b8%8d%e9%80%b2%e5%8e%bb-phpmyadmin-%e6%95%99%e5%ad%b8/" class="wp_rp_title">[MYSQL] 忘記 root 密碼，登不進去 phpMyAdmin 教學</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-357" data-post-type="none" ><a href="https://blog.wu-boy.com/2008/08/%e5%bf%83%e5%be%972008%e5%85%ab%e6%9c%88%e4%bb%bd-satainan-php-%e7%a8%8b%e5%bc%8f%e8%a8%ad%e8%a8%88-%e5%88%9d%e9%9a%8e%e8%b3%87%e8%a8%8a%e5%ae%89%e5%85%a8830/" class="wp_rp_title">[心得]2008八月份 SA@Tainan PHP 程式設計 &#8211; 初階資訊安全(8/30) </a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="4" data-poid="in-133" data-post-type="none" ><a href="https://blog.wu-boy.com/2008/01/bcb-%e5%a6%82%e4%bd%95%e5%88%a9%e7%94%a8%e9%80%a3%e7%b5%90-mysql-5%e4%bb%a5%e4%b8%8a%e8%b7%9f-mssql-server/" class="wp_rp_title">[BCB] 如何利用連結 MySQL 5以上跟 MSSQL Server</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-118" data-post-type="none" ><a href="https://blog.wu-boy.com/2007/08/sql-%e9%9a%a8%e6%a9%9f%e9%81%b8%e5%8f%96%e8%b3%87%e6%96%99-mssqlaccessmysql/" class="wp_rp_title">[SQL] 隨機選取資料 (MSSQL,ACCESS,MYSQL)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-135" data-post-type="none" ><a href="https://blog.wu-boy.com/2008/01/mysql-%e5%8f%96%e4%bb%a3%e9%83%a8%e4%bb%bd%e5%ad%97%e4%b8%b2%e5%95%8f%e9%a1%8c/" class="wp_rp_title">[MySQL] 取代部份字串問題</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-1504" data-post-type="none" ><a href="https://blog.wu-boy.com/2009/07/sql-mysql-row_number-simulation/" class="wp_rp_title">[SQL] MySQL ROW_NUMBER Simulation </a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-1781" data-post-type="none" ><a href="https://blog.wu-boy.com/2009/11/perlphp-time-and-classdate-%e6%97%a5%e6%9c%9f%e8%bd%89%e6%8f%9b%e9%81%8b%e7%ae%97/" class="wp_rp_title">[Perl&#038;PHP] time() and Class::Date 日期轉換運算</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="9" data-poid="in-285" data-post-type="none" ><a href="https://blog.wu-boy.com/2008/06/php%e8%a7%a3%e6%b1%ba%e7%b6%b2%e7%ab%99%e8%a2%ab-sql-injection-%e6%94%bb%e6%93%8a/" class="wp_rp_title">[PHP]解決網站被 SQL injection 攻擊</a><small class="wp_rp_comments_count"> (2)</small><br /></li></ul></div></div>