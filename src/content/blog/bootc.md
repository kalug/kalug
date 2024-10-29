---
title: "TOOCON2411 - A talk about bootable container"
pubDatetime: 2024-10-26
slug: bootc
tags:
  - meetup
  - TOOCON
  
description: A talk about bootable container
---

[![hackmd-github-sync-badge](https://hackmd.io/oBZXg0-RRyi86LZ1Y0S-_w/badge)](https://hackmd.io/oBZXg0-RRyi86LZ1Y0S-_w)


![南部大聚](https://scontent.fkhh1-1.fna.fbcdn.net/v/t39.30808-6/457450032_8585416838135432_237796828426830138_n.jpg?stp=cp6_dst-jpg_s720x720&_nc_cat=106&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=F9z1-FoI7agQ7kNvgHuorkA&_nc_zt=23&_nc_ht=scontent.fkhh1-1.fna&_nc_gid=AADhgBnfwsCDBbBcA1-vLpw&oh=00_AYBS2Iep2uCrZUQOdtlhaMi_52NKMhXbE30HQpTPeNgubA&oe=672623B1)

Note from Johnny Sung

https://www.facebook.com/share/p/129wP88YHmb/


ostree
https://github.com/ostreedev/ostree
Composefs
https://github.com/containers/composefs
怎麼用
```
mount -t composefs /path/to/image.cfs -o basedir=/path/to/datafiles /mnt
```
EROFS: Enhanced Read-Only File System
https://erofs.docs.kernel.org/en/latest/
bootc: Transactional, in-place operating system updates using OCI/Docker container images.
https://github.com/containers/bootc
Squashfs: compressed read-only filesystem for Linux
https://zh.m.wikipedia.org/zh-tw/SquashFS
https://docs.kernel.org/filesystems/squashfs.html
bootc image builder
https://docs.redhat.com/.../chap-anaconda-boot-options


