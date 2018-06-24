# Source of KaLUG HUGO site

master branch: only store content data
build branch: configs/layouts/themes of hugo

```
 ~ $ git clone -b build git@github.com:kalug/kalug.git
 ~ $ cd kalug
 kalug $ git worktree add content origin/master

 kalug $ hugo server
```

## How To Contribute

歡迎一起豐富網站內容, 可以直接修改 content branch
比如想要改 首頁 (content/_index.md)

可以直接透過 github的edit 功能直接修改
https://github.com/kalug/kalug/blob/content/_index.md

或是一起加入開發
