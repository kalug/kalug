---
title: "Flutter 推出 1.0 版本"
date: 2018-12-05
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/12/flutter-release-1-0-0-version/
layout: post
comments: true
---

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/appleboy/46133062882/in/dateposted-public/" title="Screen Shot 2018-12-05 at 10.25.34 AM"><img src="https://i0.wp.com/farm5.staticflickr.com/4843/46133062882_6aed05cb12_z.jpg?resize=640%2C422&#038;ssl=1" alt="Screen Shot 2018-12-05 at 10.25.34 AM" data-recalc-dims="1"></a>

很高興看到台灣時間 12/5 號 <a href="https://flutter.io/">Flutter</a> 正式推出 <a href="https://developers.googleblog.com/2018/12/flutter-10-googles-portable-ui-toolkit.html">1.0 版本</a>，相信很多人都不知道什麼是 Flutter，簡單來說開發者只要學會 Flutter 就可以維護一套程式碼，並且同時編譯出 iOS 及 Android 手機 App，其實就跟 <a href="https://facebook.com">Facebook</a> 推出的 <a href="https://facebook.github.io/react-native/">React Native</a> 一樣，但是 Flutter 的老爸是 <a href="https://google.com">Google</a>。相信大家很常看到這一兩年內，蠻多新創公司相繼找 RN 工程師，而不是分別找兩位 iOS 及 Android 工程師，原因就在後續的維護性及成本。而 Flutter 也有相同好處。我個人覺得 RN 跟 Flutter 比起來，單純對入門來說，RN 是非常好上手的，但是如果您考慮到後續的維護成本，我建議選用 Flutter，雖然 Flutter 要學一套全新的語言 <a href="https://www.dartlang.org/">Dart</a>，在初期時要學習如何使用 Widgets，把很多元件都寫成 Widgets 方便後續維護。但是在 RN 後期的維護使用了大量的第三方 Library，您想要升級一個套件可能影響到太多地方，造成不好維護。語言選擇 RN 可以使用純 JavaScript 撰寫，或者是導入 JS Flow + TypeScript 來達到 Statically Type，而 Flutter 則是使用 Dart 直接支援強型別編譯。如果現在要我選擇學 RN 或 Flutter 我肯定選擇後者。那底下來看看這次 Flutter 釋出了哪些新功能？對於 Flutter 還不了解的，可以看底下介紹影片。

<iframe width="560" height="315" src="https://www.youtube.com/embed/fq4N0hgOWzU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<span id="more-7125"></span>

<h2>Flutter 1.0</h2>

Flutter 在 1.0 版本使用了最新版 Dart 2.1 版本，那在 Dart 2 版本帶來什麼好處？此版本提供了更小的 code size，快速檢查型別及錯誤型別的可用性。這次的 Rlease 也代表之後不會再更動版本這麽快了，可以看看在 <a href="https://github.com/flutter/flutter/releases">GitHub 上 Release 速度</a>，在 1.0 還沒出來前，大概不到一週就會 Release 一版。未來應該不太會動版這麼迅速了。當然還有其他功能介紹像是 <code>Add to App</code> 或 <code>Platform Views</code> 會預計在 2019 二月正式跟大家見面。詳細介紹可以參考 <a href="https://developers.googleblog.com/2018/12/flutter-10-googles-portable-ui-toolkit.html">Flutter 1.0: Google’s Portable UI Toolkit</a>

<h2>Square SDK</h2>

<a href="https://squareup.com/us/en/flutter">Square</a> 釋出了兩套 SDK，幫助 Flutter 開發者可以快速整合手機支付，或者是直接透過 Reader 讀取手機 App 資料付款兩種方式。詳細使用方式可以參考 <a href="https://docs.connect.squareup.com/payments/readersdk/flutter">Flutter plugin for Reader SDK</a> 或 <a href="https://www.workwithsquare.com/in-app-sdk.html">Flutter plugin for In-App Payments SDK</a>

<h2>Flare 2D 動畫</h2>

Flutter 釋出 <a href="https://medium.com/2dimensions/flare-launch-d524067d34d8">Flare</a> 讓 Designer 可以快速的在 Fluter 產生動畫，這樣可以透過 Widget 快速使用動畫。所以未來 Designer 跟 Developer 可以加速 App 實作。這對於兩種不同領域的工程師是一大福音啊。

<h2>CI/CD 流程</h2>

相信大家最困擾的就是如何在 Android 及 iOS 自動化測試及同時發佈到 <a href="https://www.apple.com/tw/ios/app-store/">App Store</a> 及 <a href="https://play.google.com/store">Google Play</a>，好的 Flutter 聽到大家的聲音了，一個 Flutter 合作夥伴 <a href="https://nevercode.io/">Nevercode</a> 建立一套 <a href="https://codemagic.io">Codemagic</a>，讓開發者可以寫一套 code base 自動在 iOS 及 Android 上面測試，並且同時發佈到 Apple 及 Google，減少之前很多手動流程，此套工具還在 Beta 版本，目前尚未看到收費模式。想試用的話，可以直接在 GitHub 上面建立 Flutter 專案。登入之後選取該專案，每次 commit + push 後就可以看到正在測試及部署了。

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/appleboy/32312340038/in/dateposted-public/" title="Screen Shot 2018-12-05 at 11.32.40 AM"><img src="https://i2.wp.com/farm5.staticflickr.com/4807/32312340038_04cce52655_z.jpg?resize=640%2C344&#038;ssl=1" alt="Screen Shot 2018-12-05 at 11.32.40 AM" data-recalc-dims="1"></a>

<h2>Hummingbird</h2>

Hummingbird 是 Flutter runtime 用 web-base 方式實作，也就是說 Flutter 不只有支援原生 ARM Code 而也支援 JavaScript，未來也可以透過 Flutter 直接產生 Web 相關程式碼，開發者不用改寫任何一行程式碼，就可以直接將 Flutter 運行在瀏覽器內。詳細情形可以直接看<a href="https://medium.com/p/e687c2a023a8">官方部落格</a>，在明年 Google I/O 也會正式介紹這門技術。

<h2>後記</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/xz-F7YRrYGM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

更多詳細的影片可以參考 flutter live 18

<iframe width="560" height="315" src="https://www.youtube.com/embed/NQ5HVyqg1Qc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7137" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/12/docker-testing-with-flutter-sdk/" class="wp_rp_title">用 Docker 整合測試 Flutter 框架</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-4182" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/05/web-responsive-design-test-tool/" class="wp_rp_title">測試 Web Responsive Design Tool</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-1957" data-post-type="none" ><a href="https://blog.wu-boy.com/2010/01/how-to-install-google-web-toolkit-with-eclipse/" class="wp_rp_title">How to install Google Web Toolkit  with Eclipse</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="3" data-poid="in-3781" data-post-type="none" ><a href="https://blog.wu-boy.com/2013/01/firefox-os-developer-preview-phone-%e7%b0%a1%e4%bb%8b/" class="wp_rp_title">Firefox OS Developer Preview Phone 簡介</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="4" data-poid="in-2964" data-post-type="none" ><a href="https://blog.wu-boy.com/2011/08/%e6%8e%a8%e8%96%a6%e4%b8%80%e6%9c%ac%e6%9b%b8%e7%b1%8d-master-mobile-web-apps-with-jquery-mobile/" class="wp_rp_title">推薦一本書籍 Master Mobile Web Apps with jQuery Mobile</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li data-position="5" data-poid="in-5433" data-post-type="none" ><a href="https://blog.wu-boy.com/2014/07/upgrade-php-facebook-sdk-to-4-0-x/" class="wp_rp_title">升級 PHP Facebook SDK 到 4.0.x 版本</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-1386" data-post-type="none" ><a href="https://blog.wu-boy.com/2009/06/%e7%b6%b2%e7%ab%99-%e5%a5%bd%e7%ab%99%e9%80%a3%e7%b5%90-%e4%b8%89/" class="wp_rp_title">[網站] 好站連結 (三)</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-3555" data-post-type="none" ><a href="https://blog.wu-boy.com/2012/07/develop-iphone-moblie-web-app-tip/" class="wp_rp_title">開發 iPhone Mobile Web App 一些小技巧</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-940" data-post-type="none" ><a href="https://blog.wu-boy.com/2009/03/google-app-engine-sdk%ef%bc%9apython-%e5%9f%ba%e6%9c%ac%e6%95%99%e5%ad%b8%e5%ae%89%e8%a3%9d/" class="wp_rp_title"> Google App Engine SDK：python 基本教學安裝</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6786" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/2017-coscup-introduction-to-gitea-drone/" class="wp_rp_title">2017 COSCUP 研討會: Gitea + Drone 介紹</a><small class="wp_rp_comments_count"> (4)</small><br /></li></ul></div></div>