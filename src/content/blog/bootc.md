---
title: "TOOCON2411 - A talk about bootable container"
pubDatetime: 2024-10-26
slug: 
tags:
  - meetup
  - TOOCON
  
description: A talk about bootable container
---



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


