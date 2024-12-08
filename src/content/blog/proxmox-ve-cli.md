---
title: "1114 Proxmox VE CLI 工具"
pubDatetime: 2024-11-14T20:00:00+08
slug: proxmox-ve-cli
author: lloyd
tags:
  - meetup
description: proxmox
youtube: oV7ieVW4dFI
---

[![hackmd-github-sync-badge](https://hackmd.io/nak2PLqRTnyOJEwLiuAU-A/badge)](https://hackmd.io/nak2PLqRTnyOJEwLiuAU-A)

上次 我們用 jitsi + youtube live, 但中途hdmi 斷了, 直播出了問題
這次 lloyd 將 為我們介紹 Proxmox VE CLI 工具, 主播部分我們改用 google meets 試試看效果

時間: 11/14 20:00
link: https://meet.google.com/pxq-sdrw-ccr

## Proxmox qm

- https://pve.proxmox.com/pve-docs/qm.1.html

## cloud-init

qm cloud-init
cloud-init

## GPU Passthrough

- 不要在 host 主機 mount
- 顯卡在 PVE 上有 ID，最後一個 VM 配一張顯卡

https://pve.proxmox.com/wiki/PCI_Passthrough

## Proxmox make image

## zfs

## cluster

- https://pve.proxmox.com/wiki/Cluster_Manager

Q&A

- 想請教一下network管理使用經驗
  - https://pve.proxmox.com/wiki/Network_Configuration
  - https://pve.proxmox.com/wiki/Software-Defined_Network

## 參考資料：

- https://pve.proxmox.com/wiki/Shell_interface_for_the_Proxmox_VE_API
- https://pve.proxmox.com/wiki/Proxmox_VE_API

- https://pve.proxmox.com/wiki/Command_Line_Tools

- Proxmox vs virsh https://taleghani.medium.com/sharing-my-experience-using-kvm-virt-manager-libvirt-and-proxmox-as-an-allinone-solution-9c39fb2cc192

- 更強大的 Proxmox VE 命令列管理工具 - pvesh：https://blog.jason.tools/2019/02/pve-cli-api.html

- https://pve.proxmox.com/wiki/PCI_Passthrough
-
