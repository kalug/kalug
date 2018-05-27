#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os

import feedparser
import yaml

from time import strftime


def fetch_rss(rss, path):
    feed = feedparser.parse(rss['url'])
    items = feed['items']
    
    for item in items:
        tm = item['published_parsed']
        title = item['title']
        purelink = item['link'].strip('/')
        fileName = "{}_{}.md".format(strftime("%Y%m%d",tm),purelink.split('/')[-1])

        f = open(os.path.join(path, rss['id'], fileName),'w')
        value = item['content'][0]['value']
        f.write('''---
title: "{}"
date: {}
type: blog
layout: post
comments: true
---

'''.format(title, strftime("%Y-%m-%dT%H:%M",tm)))
        f.write(value)
for rss in yaml.load(open('planet.yml', 'r').read()):
    fetch_rss(rss, "content/planet/")
