---
title: "[Event notice] KaLUG2411 - 第一次 85大樓 大港創鑑 聚會"
pubDatetime: 2024-11-30T15:00:00
slug: meetup2411
author: tuna
tags:
  - warp
  - cli
description: Tuna 要分享 warp 這個工具，現在有 Mac/Linux 版本了, 帶AI的 terminal 幫我們簡化那些流程呢
youtube: bdI0HlvNyqg
googlemeet: vdh-gqor-hap
googlemap: uKVP6sQv79tYprvb8
meetupLocation: 大港創鑑 Megabay 85大樓19F (紅線 三多商圈站)
---

> 本頁為共筆 歡迎大家一起維護
> [![hackmd-github-sync-badge](https://hackmd.io/iYx5Gh0OTbKM1JIOQ8U3TQ/badge)](https://hackmd.io/iYx5Gh0OTbKM1JIOQ8U3TQ)

Tuna 要分享 warp 這個工具，現在有 Mac/Linux 版本了, 帶AI的 terminal 幫我們簡化那些流程呢

時間: 11/30 下午3:00
地點: 大港創鑑 Megabay 85大樓19F
https://kalug.kktix.cc/events/241130

- 主段
  - KaLUG.tw + Hackmd (10 mins) shawn/lloyd/eric
  - 大港創鑑 介紹 (5~10 mins)
  - Warp - AI terminal (20 mins) - shawn/tuna
    - warp 代班
    - warp notebook demo - btrfs 範例
    - cosmic DE - 簡單 demo
  - OpenSourceSummit 遊記 - mac
- 自我介紹 / 聊天段 (不直播)
- 總結段 (15 mins) - 一人約 1~3 mins

## Shawn 代班講 Warp

- Warp Beta
- wave (golang version), 不過兩個選我用 warp
- 其實 也許 emacs 就有機會有 warp 功能

### Warp - The intelligent terminal.

- https://www.warp.dev/
- Support MacOS/Linux
  - https://app.warp.dev/download?package=rpm
  - deb
- Collaboration for teams

repo

```
[warpdotdev-beta]
name=warpdotdev-beta
baseurl=https://releases.warp.dev/linux/rpm/beta
enabled=1
gpgcheck=1
gpgkey=https://releases.warp.dev/linux/keys/warp.asc
```

### 喜歡 Warp 的點 & shawn個人替代方案

- Warp <==> fish + atuin + tmux + CosmicDE
- AI (沒覺得特別好用 也許等 tuna 秀亮點)
- shell hint --- fish / atuin (history)
- Notebook and shell execution (沒有替代)
  - 但 Warp Drive 沒有支援 git 不方便轉換
  - Hackmd 的 編譯功能不輸
- block sharing (沒有替代)
  - asciinema 類似, 不過有時會亂碼
- Session sharing / tmux / zellij (算沒有替代)
- tiling windows like layout --- comsic DE

## 除了 warp 外 主題

歡迎大家留一下 有想聊的主題

1. kalug.tw online
2. btrfs subvolume
3. colab 使用
4. ventoy 裝機

---

[![Warp demo](https://img.youtube.com/vi/34INSNevPOk/0.jpg)](https://www.youtube.com/watch?v=34INSNevPOk)

https://hackmd.io/@Tuna/rJb7iv0lyx

{%hackmd @Tuna/rJb7iv0lyx %}
