---
title: "MySQL 中文Big5轉至UTF-8"
date: 2006-08-17
type: blog
author: qerter
link: http://feedproxy.google.com/~r/qerter/~3/ORdV-8pY1Ck/mysql-big5utf-8.html
layout: post
comments: true
---

因為工作需要，必須要將原本MS Access中的資料轉換至MySQL。MS Access 預設編碼為Big5 ，MySQL中以UTF-8存放資料，Collation為utf8_unicode_ci。並且在phpMyAdmin中觀看正常。將從MS Access自己寫程式匯出的sap.sql檔案（編碼UTF-8)，<br /><br />要匯入MySQL之前。有以下步驟：<br /><code><br />mysql> SET CHARACTER SET 'utf8';<br /></code><br />設定DataBase 預設編碼<br /><code><br />mysql> ALTER DATABASE  test DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;<br /></code><br />設定資料表預設編碼<br /><code><br />mysql> use test;<br />mysql> ALTER TABLE `test_table` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;<br /></code><br />匯入sap.sql<br /><code><br />mysql> \.sap.sql<br /></code><br />這樣就可以在phpMyAdmin中觀看正常的UTF-8中文，校對為utf8_unicode_ci。<br /><br />Note:<br /><br />不知道為什麼使用set names UTF-8 會使得匯入sql的中文字變成問號，不使用就正常了。