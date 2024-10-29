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

---

# Immutable solutions

Upgrade system always is a pain point for me, especially with package manager systems.
They could work just sometime accident might happen, then need a lot of human operation to fix it.

There are lots of immutable solutions for os upgrade.

## solution concepts:
- A/B switch
  -  systemd usr-merge
- file system snapshot
- oci image

## solutions:
- ubuntu snap
- nixos
- talos
- bootc/ostree
- elemental-toolkit

## OCI ecosystem

- container engine - podman
  - build / pull images

# bootc - bootable container


- ostree
- composefs

bootc as a bootable container runtime but it not really a runtime, more like a deployer.

https://github.com/containers/bootc

I really like bootc concept and thought it would the next `docker`.


## podman with composefs as storage backend

[Composefs state of the union](https://blogs.gnome.org/alexl/2023/07/11/composefs-state-of-the-union/)

https://github.com/containers/storage/pull/1646


https://github.com/containers/storage/blob/main/docs/containers-storage-composefs.md

containers-storage.conf /etc/containers/storage.conf

```

pull_options = {enable_partial_images = "true", use_hard_links = "true", ostree_repos="",  convert_images = "true"}

[storage.options.overlay]
use_composefs = "true"

```

```
[storage.options.pull_options]
convert_images = "true"
```

* [mount-cfs-oci.sh](/assets/mount-cfs-oci.sh)

```bash
#!/bin/bash

TAG=${TAG:=docker.io/library/alpine:latest} 
MNT=${MNT:=/mnt}

BASEDIR=/var/lib/containers/storage/overlay
INDEX_FN=$BASEDIR/../overlay-images/images.json


LAYER=$(cat ${INDEX_FN} | jq -r '.[] | select( .names |  any( "$TAG" ) )  | .layer')

mount -t composefs ${BASEDIR}/${LAYER}/composefs-data/composefs.blob -o basedir=${BASEDIR} $MNT
```


```
$ podman pull quay.io/centos-bootc/centos-bootc:stream9
$ podman image save quay.io/centos-bootc/centos-bootc:stream9 -o stream9.tar #(oci)

# podman image mount  quay.io/centos-bootc/centos-bootc:stream9
/var/lib/containers/storage/overlay/98cf94224120f2355d5efc4df25632f6789c3b251f52cc0893562f959d72a7f6/merged
# mkcomposefs /var/lib/containers/storage/overlay/98cf94224120f2355d5efc4df25632f6789c3b251f52cc0893562f959d72a7f6/merged --digest-store=/sysroot/composefs/repo /sysroot/composefs/images/bootc-cs9.cfs

# mount -o rw,remount /sysroot/
# initrd
#mount --bind /sysroot /sysroot.tmp

Containerfile `ln -s sysroot/composefs composefs`


mkdir /sysroot.tmp
mount /dev/vda3 /sysroot.tmp

mount -t composefs /sysroot.tmp/composefs/images/bootc-cs9.cfs -o basedir=/sysroot/composefs/repo /sysroot

mount --bind /sysroot.tmp/ostree/deploy/default/deploy/37595a2f96fc23131eef6af87920858e6eecc4de5540ef3278aa7e184c7d4d5c.0/etc /sysroot/etc
mount --bind /sysroot.tmp/ostree/deploy/default/var /sysroot/var

modprobe zram
modprobe xfs
```

