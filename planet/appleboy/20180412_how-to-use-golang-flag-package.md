---
title: "如何使用 Go 語言 Flag 套件 (影片教學)"
date: 2018-04-12
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/04/how-to-use-golang-flag-package/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/24407557644/in/dateposted-public/" title="Go-brown-side.sh"><img alt="Go-brown-side.sh" src="https://i1.wp.com/farm2.staticflickr.com/1622/24407557644_36087ca6de.jpg?w=840&#038;ssl=1" /></a>

之前寫過一篇『<a href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/">用 Golang 寫 Command line 工具</a>』教學，作者我錄了一個教學影片，教大家如何使用 <a href="https://golang.org">Go 語言</a>的 <a href="https://golang.org/pkg/flag/">Flag</a> 套件，套件用法很簡單，相信看了底下的影片教學馬上就會了，但是在這邊強調，用 flag 的時機會是在寫 command line tool 給同事或者是自己用，如果是寫大型 Web Application，不推薦使用 flag，原因是 flag 不支援讀取系統環境變數，如果是 web 服務，想要動態改變 port 或者是 DB 連線資訊，就變得比較複雜，也無法搭配 <a href="https://www.docker.com/">Docker</a> 使用，更不用說想結合 <a href="https://kubernetes.io/">Kubernetes</a>。如果要寫大專案，請使用 <a href="https://github.com/urfave/cli">urfave/cli</a> 或 <a href="https://github.com/spf13/cobra">spf13/cobra</a>。

<span id="more-6998"></span>



<h3>線上課程</h3>

有興趣的話，可以直接<a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-INTRO">購買課程</a>，現在特價 $1600，未來會漲價，另外課程尚未錄製完成，會陸陸續續分享 Go 的開發技巧。
<div class="wp_rp_wrap  wp_rp_plain"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/">用 Golang 寫 Command line 工具</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/04/devops-bot-in-golang/">用 Go 語言打造 DevOps Bot</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/10/go-configuration-with-viper/">在 Go 語言使用 Viper 管理設定檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/09/deploy-go-app-to-zeit-now/">部署 Go 語言 App 到 Now.sh</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/12/send-line-message-using-drone-line/">用 drone-line 架設 Line webhook 及發送訊息</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/08/golang-tesing-on-jenkins/">在 Jenkins 跑 Golang 測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/03/golang-dependency-management-tool-dep/">Go 語言官方推出的 dep 使用心得</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2018/03/simple-queue-with-optimistic-concurrency-in-go/">用 Go 語言實現單一或多重 Queue 搭配 optimistic concurrency</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/09/drone-ci-server-integrate-atlassian-bitbucket-server/">Drone CI Server 搭配 Atlassian Bitbucket Server (前身 Stash)</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/11/golang-gofight-support-echo-framework/">輕量級 Gofight 支援 Echo 框架測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>