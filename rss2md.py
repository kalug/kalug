#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os

import feedparser
import yaml

from time import mktime, strftime


def fetch_rss(rss, path):
    feed = feedparser.parse(rss['url'])
    items = feed['items']
    path = os.path.join(path, rss['id'])
    os.makedirs(path, exist_ok=True)

    for item in items:
        tm = item['published_parsed']
        title = item['title']
        purelink = item['link'].strip('/')
        fileName = "{}_{}.md".format(strftime("%Y%m%d",tm),purelink.split('/')[-1])
        fn = os.path.join(path, fileName)
        f = open(fn, 'w')
        value = item['content'][0]['value']
        f.write('''---
title: "{}"
date: {}
type: blog
author: {}
link: {}
layout: post
comments: true
---

'''.format(title, strftime("%Y-%m-%d",tm), rss['author'], item['link']))
        f.write(value)
        f.close()

        os.utime(fn, (mktime(tm), mktime(tm)))

for rss in yaml.load(open('planet.yml', 'r').read()):
    #print(rss)
    fetch_rss(rss, "content/planet/")
