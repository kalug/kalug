---
title: "將 Go Html Template 存入 String 變數"
date: 2018-02-28
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/02/simply-output-go-html-template-execution-to-strings/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/24407557644/in/dateposted-public/" title="Go-brown-side.sh"><img alt="Go-brown-side.sh" src="https://i1.wp.com/farm2.staticflickr.com/1622/24407557644_36087ca6de.jpg?w=840&#038;ssl=1" /></a>

在 <a href="https://golang.org/">Go 語言</a>內通常都將 <a href="https://golang.org/pkg/text/template/">Html Temaple</a> 寫入到 <code>io.Writer interface</code> 像是 <code>*http.ResponseWriter</code>，但是有些情境需要將 Template 寫入到 String 變數內，例如實作簡訊 Template，這時候需要將 Html Temaple 轉成 String。該如何實作，非常簡單，只需要在任意變數內實作 <code>io.Writer interface</code> 即可，而 String 該如何轉換呢？可以使用 buffer&#8217;s pointer

<span id="more-6963"></span>

<pre class="brush: go; title: ; notranslate">
func GetString(filename string, data interface{}) (string, error) {
    t := template.New(filename).Funcs(NewFuncMap())

    content, err := ReadFile(filename)

    if err != nil {
        logrus.Warnf("Failed to read builtin %s template. %s", filename, err)
        return "", err
    }

    t.Parse(
        string(content),
    )

    var tpl bytes.Buffer
    if err := t.Execute(&amp;tpl, data); err != nil {
        return "", err
    }

    return tpl.String(), nil
}
</pre>

其中 <code>ReadFile</code> 是讀取檔案函式，<code>NewFuncMap</code> 則是 <a href="https://golang.org/pkg/text/template/#FuncMap">Function Map</a>。
<div class="wp_rp_wrap  wp_rp_plain"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/10/go-configuration-with-viper/">在 Go 語言使用 Viper 管理設定檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/11/grpc-health-check-in-go/">Go 語言實現 gRPC Health 驗證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2018/03/simple-queue-with-optimistic-concurrency-in-go/">用 Go 語言實現單一或多重 Queue 搭配 optimistic concurrency</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/11/downsize-node-modules-with-golang/">用 Go 語言減少 node_modules 容量來加速部署</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/11/golang-gofight-support-echo-framework/">輕量級 Gofight 支援 Echo 框架測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2018/04/init-func-in-golang/">Go 語言的 init 函式</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>