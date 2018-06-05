---
title: "[第參期] 安裝Debian Etch 在 Asus eee box上"
date: 2009-01-20
type: blog
author: qerter
link: http://feedproxy.google.com/~r/qerter/~3/GP6oFefP3no/debian-sarge-asus-eee-box.html
layout: post
comments: true
---

此篇教學目的為安裝Debian Etch在eee box上，可正常使用X-window與ethernet網路。<br /><ol><li>首先去下載Debian Etch CD1 iso，目前版本是<a href="ftp://ftp.tw.debian.org/debian-cd/4.0_r6/i386/iso-cd/debian-40r6-i386-CD-1.iso">4.0_r6</a>，燒錄於光碟中。<br /></li><li>使用USB CDROM開機進行安裝，安裝時不使用鏡像站。<br /></li><li>安裝完畢，重新使用硬碟開機。<br /></li><li>登入後，使用APT指令安裝build-essential與linux-headers-2.6.18-3-686這兩樣套件。<br /></li><li>使用另一台可上網的電腦至Realtek網站下載中心，下載<a href="ftp://202.65.194.212/cn/nic/r8168-8.010.00.tar.bz2">R8168</a> chip driver<br /></li><li>使用隨身碟將下載好的<span style="font-size:100%;">r8168-a.bbb.cc.tar.bz2 複製至eee box主機硬碟中（需手動掛載隨身碟）。<br /></span></li><li><span style="font-size:100%;">解壓縮r8168-a.bbb.cc.tar.gz，依造內附文件readme下指令驅動Ethernet網卡。<br /></span></li><li><span style="font-size:100%;">若安裝完畢後後，則可使用lsmod |grep r8168檢查是否成功載入Ethernet網卡driver。<br /></span></li><li><span style="font-size:100%;">修改/etc/X11/xorg.conf的內容，於Section "Device"中，將Driver "i810" 修改為 Driver "vesa"。修改後，重新啟動GDM(/etc/init.d/gdm restart)。<br /></span></li><li><span style="font-size:85%;"><span style="font-size:100%;">GDM啟動，使用帳號密碼登入。</span><br /></span></li></ol>