---
title: "Github pages X Hackmd"
pubDatetime: 2024-11-09
slug: hackmd
tags:
  - hackmd
author: shawn 
description: How we use HackMD for KaLUG.tw

---

# KaLUG.tw 當 Github pages 遇上 HackMD

KaLUG的首頁停擺了一段時間, 最近花了一些時間重新整理時, 發現Hackmd的 github sync 功能很方便.
讓我來跟大家介紹我們的處理方式.

## why HackMD?

雖然 Github repo 也有簡易的 Editor, 可以不需要 clone 到編輯人的本地. 而HackMD的編輯界面上有善很多, 也支援多人同時編輯, 註解等，權限控管很有彈性.



## GitHub sync


![screenshot-2024-11-09-02-30-53](https://hackmd.io/_uploads/Syq_YHnZye.png)

Hackmd 可以link 單一Hackmd page 到特定github repo的路徑.
設定完成後, 可以做 pull (從github拉), push (更新回 github).

### 如何編輯
目前在 已經連接 github 與 HackMD的頁面上, 
我們都有加上HackMD badge, 按下後就可以連到Hackmd 做編輯.

### 新增 Add badge
HackMD 在 GitHub sync 頁面有個  "Add badge"

### push to github, github action

KaLUG.tw 目前用 astro.js 當做 Static Site Generators, 在之前我們用 Hugo. 都有支援Markdown很方便接 HackMD.

如果設定好 github action, 就可以透過 HackMD 編輯後push, 觸發 github action 編譯後, Github Pages就更新完畢.

## HackMD team 功能
https://hackmd.io/@kalug

有 HackMD team 功能, 除了 KaLUG.tw 可以露出,  HackMD team profile 要找資料也方便.
