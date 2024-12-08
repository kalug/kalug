---
title: "MOPCON - kalug.tw go online"
pubDatetime: 2024-10-27T11:00:00+08
author: shawn
slug: lets-meet-online
tags:
  - jitsi
  - youtube
  - stream
  - gh-pages
  - gh-discussions
  - hackmd
  - kalug.tw
  - meetup

description: 改版後的 kalug.tw 首頁, 支援共筆/註解/按讃. 另外現場用 Jitsi + YouTube stream 作為未來線上並實體討論的實驗
---

[![hackmd-github-sync-badge](https://hackmd.io/9M2W8-VtRKmrzbAqmgPJIw/badge)](https://hackmd.io/9M2W8-VtRKmrzbAqmgPJIw)

# MOPCON - unconf X KaLUG - let's go online, kalug.tw

改版後的 kalug.tw 首頁, 支援共筆/註解/按讃. 另外現場用 Jitsi + YouTube stream 作為未來線上並實體討論的實驗

[![MOPCON2024 unconf](https://img.youtube.com/vi/2s7OTjtuOio/0.jpg)](https://www.youtube.com/watch?v=2s7OTjtuOio)

## astro.js

改用 astro.js 作為 GitHub Pages.

### AstroPaper

https://github.com/satnaing/astro-paper

一個泰國前端做的project, 2.5k星星, @shawn111 挑的原因是很簡潔.

astro.js 所謂的 template 其實是整個 clone 下來, @shawn111 拉下的時候也包含很多原始檔案, 這也是內容有時候可能還怪怪的, 比如目前的REAMDE.

astro.js init

```
npm create astro@latest -- --template satnaing/astro-paper kalug
```

這個部分 hugo (Go版) / zola (Rust版) 就方便一點, 切換template部分.

### content

內容走 Markdown, 透過 HackMD GitHub sync 功能, 當新內容更新後 GitHub Actions 編譯後推上 GitHub Pages.

src/content/blog

- lets-meet-online.md
- meetup-1811.md
- meetup-1812.md

### gitcus-comments

https://astro-paper.pages.dev/posts/how-to-integrate-giscus-comments/

src/layouts/PostDetails.astro

```
--- a/src/layouts/PostDetails.astro

+import Comments from "@components/Comments";
 import Datetime from "@components/Datetime";
 import type { CollectionEntry } from "astro:content";
 import { slugifyStr } from "@utils/slugify";
@@ -177,6 +178,7 @@ const nextPost =
         )
       }
     </div>
+    <Comments client:only="react" />
   </main>
```

### astro 5 - new feature content collection

TODO 這個很cool 也許可以做我們星球(kalug.tw 的朋友們寫的各 blog) 收進來來源

Feed loader 可以收 RSS.
https://astro.build/blog/community-loaders/

## online stream

### 只試過一次的 Discord

上個月 日落 給大家帶來 `rust 版搜索引擎 Meilisearch` 分享, 也是我們第一次嘗試線上 (Discord) &實體聚會.
上次的分享很精彩, 就是沒法錄 (大家沒深入看,似乎有webhook, unconf 現場也有朋友提可以， 如果有清楚的朋友歡迎補充)

### Jitsi + YouTube stream

https://jitsi.org/blog/live-streaming-with-jitsi-and-youtube/

- jitsi 預設就有
- youtube 段， 需要先準備 api token

原來 youtube stream 不是直播完就有, 還有個處理時間

### skynet - Jitsi AI summaries

- https://github.com/jitsi/skynet
- https://fosdem.sojourner.rocks/2024/event/3591
  - 6:10 附近有demo

![skynet - a bots framework](https://hackmd.io/_uploads/BJJWkm6xyg.png)

這個很cool, 自動幫我們總結
不過短時間應該不會導入
