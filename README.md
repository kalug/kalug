# Source of KaLUG HUGO site

[![CircleCI](https://circleci.com/gh/kalug/kalug.svg?style=svg)](https://circleci.com/gh/kalug/kalug)

master branch: only store content data
build branch: configs/layouts/themes of hugo

```
 ~ $ git clone -b build git@github.com:kalug/kalug.git
 ~ $ cd kalug
 kalug $ git worktree add content origin/master -b master
 kalug $ git submodule add https://github.com/halogenica/beautifulhugo.git themes/beautifulhugo/


 kalug $ hugo server
```

## How To Contribute

歡迎一起豐富網站內容, 可以直接修改 master branch
比如想要改 首頁 (_index.md)

在content頁面上 加上 {{< edit_me >}} 就可以產生 Edit me的button 連結github讓大家比較好編輯

可以直接透過 github的edit 功能直接修改
https://github.com/kalug/kalug/blob/content/_index.md

或是一起加入開發
