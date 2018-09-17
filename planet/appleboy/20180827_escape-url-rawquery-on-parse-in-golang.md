---
title: "在 Go 語言內的 URL RawQuery 的改變"
date: 2018-08-27
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/08/escape-url-rawquery-on-parse-in-golang/
layout: post
comments: true
---

<strong>更新 (2018.08.29) 感謝中國網友幫忙發個 <a href="https://github.com/golang/go/issues/27302">Issue</a>，大家有空可以關注看看，等官方怎麼回應</strong>

<a href="https://www.flickr.com/photos/appleboy/40093179410/in/dateposted-public/" title="Go-Logo_Blue"><img src="https://i1.wp.com/farm1.staticflickr.com/908/40093179410_53df4bb9e8_z.jpg?w=840&#038;ssl=1" alt="Go-Logo_Blue" data-recalc-dims="1" /></a>

<a href="https://golang.org/">Go 語言</a>內的 <code>net/url</code> 函式庫讓開發者可以簡單的 Parse 指定的 URL，最近 Google 上了這個 <a href="https://github.com/golang/go/commit/1040626c0ce4a1bc2b312aa0866ffeb2ff53c1ab">Patch</a>，這個 Patch 讓原本的 RawQuery 值產生了變化，原先沒有驗證 RawQuery 是否包含了不合法的字元，現在只要 RawQuesy 內含有任意的不合法字元，就會直接被 <code>QueryEscape</code> 函式轉換，這個 Patch 不影響這次 <a href="https://blog.golang.org/go1.11">Go 1.11 版本</a>，會影響的是明年 2019 年釋出的 Go 1.12 版本，但是大家都知道在 <a href="https://github.com">GitHub</a> 上面有在寫測試的話，都會在 <a href="https://travis-ci.org">Travis</a> 內加入 <code>master</code> 版本當作驗證，如果有用到 RawQuery 的話，肯定會遇到這問題，底下來描述為什麼會出現這問題。

<span id="more-7068"></span>

<h2>RawQuery 含有不合法字元</h2>

首先來看看在 Go 1.11 版本時本來應該輸出什麼，請直接線上看<a href="https://play.golang.org/p/ZvZ-SoUjK16">例子</a>。

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;log&quot;
    &quot;net/url&quot;
)

func main() {
    u, err := url.Parse(&quot;http://bing.com/search?k=v&amp;id=main&amp;id=omit&amp;array[]=first&amp;array[]=second&amp;ids<em></em>=111&amp;ids[j]=3.14&quot;)
    if err != nil {
        log.Fatal(err)
    }

    if u.RawQuery != &quot;k=v&amp;id=main&amp;id=omit&amp;array[]=first&amp;array[]=second&amp;ids<em></em>=111&amp;ids[j]=3.14&quot; {
        log.Fatal(&quot;RawQuery error&quot;)
    }

    log.Printf(&quot;%#v&quot;, u.Query())
}
</pre>

在 Go 1.11 以前，你會直接看到底下輸出:

<blockquote>
  url.Values{&#8220;k&#8221;:[]string{&#8220;v&#8221;}, &#8220;id&#8221;:[]string{&#8220;main&#8221;, &#8220;omit&#8221;}, &#8220;array[]&#8221;:[]string{&#8220;first&#8221;, &#8220;second&#8221;}, &#8220;ids<em></em>&#8220;:[]string{&#8220;111&#8221;}, &#8220;ids[j]&#8221;:[]string{&#8220;3.14&#8221;}}
</blockquote>

<a href="https://golang.org/pkg/net/url/">url 函式庫</a>幫忙把 RawQuery 整理成 map[string][]string 格式，所以在 URL 內可以直接 Parse <code>array[]=first&amp;array[]=second</code> 多個 Array 值。這個預設行為在最新的 Go 語言被換掉了，現在執行 <code>u.Query()</code> 你會看到變成底下，整串的 Raw Query String 被當長一個 Key 值了。

<blockquote>
  url.Values{&#8220;k=v&amp;id=main&amp;id=omit&amp;array[]=first&amp;array[]=second&amp;ids<em></em>=111&amp;ids[j]=3.14&#8243;: []string{&#8220;&#8221;}}
</blockquote>

這就是最大的改變，造成在 Travis 執行錯誤。

<h2>如何修正</h2>

修正方式其實很簡單，自己在寫個小型 Parser 把原本的格式在轉換就好，請參考<a href="https://play.golang.org/p/wO9vR3Ylliq">線上解法</a>

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;log&quot;
    &quot;net/url&quot;
    &quot;strings&quot;
)

func main() {
    u, err := url.Parse(&quot;http://bing.com/search?k=v&amp;id=main&amp;id=omit&amp;array[]=first&amp;array[]=second&amp;ids<em></em>=111&amp;ids[j]=3.14&quot;)
    if err != nil {
        log.Fatal(err)
    }

    if u.RawQuery != &quot;k=v&amp;id=main&amp;id=omit&amp;array[]=first&amp;array[]=second&amp;ids<em></em>=111&amp;ids[j]=3.14&quot; {
        log.Fatal(&quot;RawQuery error&quot;)
    }

    log.Printf(&quot;%#v&quot;, u.Query())

    query := resetQuery(map[string][]string{&quot;k=v&amp;id=main&amp;id=omit&amp;array[]=first&amp;array[]=second&amp;ids<em></em>=111&amp;ids[j]=3.14&quot;: []string{&quot;&quot;}})
    log.Printf(&quot;%#v&quot;, query)
}

func resetQuery(m map[string][]string) map[string][]string {
    dicts := make(map[string][]string)
    for k, v := range m {
        lists := strings.Split(k, &quot;&amp;&quot;)
        if len(lists) == 1 {
            dicts[k] = v
            continue
        }
        for _, vv := range lists {
            p := strings.Split(vv, &quot;=&quot;)
            dicts[p[0]] = append(dicts[p[0]], p[1])
        }
    }
    return dicts
}
</pre>

只要 RawQuery 裡面有包含底下字元，就會被 escape 掉

<pre class="brush: plain; title: ; notranslate">
// validQuery reports whether s is a valid query string per RFC 3986
// Section 3.4:
//     query       = *( pchar / &quot;/&quot; / &quot;?&quot; )
//     pchar       = unreserved / pct-encoded / sub-delims / &quot;:&quot; / &quot;@&quot;
//     unreserved  = ALPHA / DIGIT / &quot;-&quot; / &quot;.&quot; / &quot;_&quot; / &quot;~&quot;
//     sub-delims  = &quot;!&quot; / &quot;$&quot; / &quot;&amp;&quot; / &quot;&#039;&quot; / &quot;(&quot; / &quot;)&quot;
//                   / &quot;*&quot; / &quot;+&quot; / &quot;,&quot; / &quot;;&quot; / &quot;=&quot;
</pre>

<h2>後記</h2>

現在含以前的版本都不會遇到這問題，如果你有用一些 Framework 請務必在明年釋出下一版後，一起跟著升級，<a href="https://github.com/gin-gonic/gin">Gin</a> 現在已經發 <a href="https://github.com/gin-gonic/gin/pull/1510">Patch</a> 修正了。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-7021" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/" class="wp_rp_title">如何在 Go 專案內寫測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-6661" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/write-command-line-in-golang/" class="wp_rp_title">用 Golang 寫 Command line 工具</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="4" data-poid="in-6721" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/" class="wp_rp_title">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="5" data-poid="in-6963" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/02/simply-output-go-html-template-execution-to-strings/" class="wp_rp_title">將 Go Html Template 存入 String 變數</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-7047" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/mkcert-zero-config-tool-to-make-locally-trusted-development-certificates/" class="wp_rp_title">在本機端快速產生網站免費憑證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-7013" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/init-func-in-golang/" class="wp_rp_title">Go 語言的 init 函式</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6877" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/grpc-health-check-in-go/" class="wp_rp_title">Go 語言實現 gRPC Health 驗證</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>