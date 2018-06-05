---
title: "使用Mutt收GMail IMAP電子郵件, Part 3 封存郵件篇"
date: 2010-05-16
type: blog
author: qerter
link: http://feedproxy.google.com/~r/qerter/~3/rtjf-YQp7A8/muttgmail-imap-part-3.html
layout: post
comments: true
---

在[<a href="http://qerter.blogspot.com/2009/10/muttgmail-imap-part-2-procmail.html">使用Mutt收GMail IMAP電子郵件, Part 2 Procmail篇</a>]的文章裡，我們使用procmail來幫我們將郵件做分類。但是，一般性沒辦法分類的聯絡郵件還是會全部進到mbox（主郵件檔案）裡，隨著時間日積月累，mbox檔案大小會隨著時間越久，檔案會越變越大，Mutt讀取mbox檔案速度因此而變慢。<br /><br />此時，我們需要將舊郵件做封存(Archive)，方能解決mbox檔案隨著時間越變越大的問題。在Debian下，我們可以使用archivemail程式來幫我們的舊郵件做封存。使用方法十分簡單，如下：<br /><br /><code>archivemail --suffix '_%B_%Y' --days=90  mbox<br /></code><br /><br />archivemail程式就會將mbox檔案中超過90天以上的郵件封存壓縮，並且獨立成另外一個檔案，檔名後面加註月份與年份，檔名範例如 mbox_February_2010.gz。<br /><br />archivemail程式可搭配cron將郵件檔案定期做封存，支援IMAP, mbox, MH與Maildir 郵件檔案格式。