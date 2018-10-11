---
title: "Go 語言的 graphQL-go 套件正式支援 Concurrent Resolvers"
date: 2018-09-16
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/09/graphql-go-library-support-concurrent-resolvers/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/30836371338/in/dateposted-public/" title="GraphQL_Logo.svg"><img src="https://i2.wp.com/farm2.staticflickr.com/1852/30836371338_14b636b465_z.jpg?w=840&#038;ssl=1" alt="GraphQL_Logo.svg" data-recalc-dims="1" /></a>

要在 <a href="https://golang.org">Go 語言</a>寫 graphQL，大家一定對 <a href="https://github.com/graphql-go/graphql">graphql-go</a> 不陌生，討論度最高的套件，但是我先說，雖然討論度是最高，但是效能是最差的，如果大家很要求效能，可以先參考此<a href="https://github.com/appleboy/golang-graphql-benchmark">專案</a>，裡面有目前 Go 語言的 graphQL 套件比較效能，有機會在寫另外一篇介紹。最近 graphql-go 的作者把 Concurrent Resolvers 的解法寫了一篇 <a href="https://github.com/graphql-go/graphql/issues/389">Issue 來討論</a>，最終採用了 <a href="https://github.com/graphql-go/graphql/pull/388">Resolver returns a Thunk</a> 方式來解決 Concurrent 問題，這個 PR 沒有用到額外的 goroutines，使用方式也最簡單

<pre class="brush: go; title: ; notranslate">
&quot;pullRequests&quot;: &amp;graphql.Field{
    Type: graphql.NewList(PullRequestType),
    Resolve: func(p graphql.ResolveParams) (interface{}, error) {
        ch := make(chan []PullRequest)
        // Concurrent work via Goroutines.
        go func() {
            // Async work to obtain pullRequests.
            ch &lt;- pullRequests
        }()
        return func() interface{} {
            return &lt;-ch
        }, nil
    },
},
</pre>

<span id="more-7081"></span>

<h2>使用方式</h2>

先用一個簡單例子來解釋之前的寫法會是什麼形式

<pre class="brush: go; title: ; notranslate">
package main

import (
    &quot;encoding/json&quot;
    &quot;fmt&quot;
    &quot;log&quot;
    &quot;time&quot;

    &quot;github.com/graphql-go/graphql&quot;
)

type Foo struct {
    Name string
}

var FieldFooType = graphql.NewObject(graphql.ObjectConfig{
    Name: &quot;Foo&quot;,
    Fields: graphql.Fields{
        &quot;name&quot;: &amp;graphql.Field{Type: graphql.String},
    },
})

type Bar struct {
    Name string
}

var FieldBarType = graphql.NewObject(graphql.ObjectConfig{
    Name: &quot;Bar&quot;,
    Fields: graphql.Fields{
        &quot;name&quot;: &amp;graphql.Field{Type: graphql.String},
    },
})

// QueryType fields: `concurrentFieldFoo` and `concurrentFieldBar` are resolved
// concurrently because they belong to the same field-level and their `Resolve`
// function returns a function (thunk).
var QueryType = graphql.NewObject(graphql.ObjectConfig{
    Name: &quot;Query&quot;,
    Fields: graphql.Fields{
        &quot;concurrentFieldFoo&quot;: &amp;graphql.Field{
            Type: FieldFooType,
            Resolve: func(p graphql.ResolveParams) (interface{}, error) {
                type result struct {
                    data interface{}
                    err  error
                }
                ch := make(chan *result, 1)
                go func() {
                    defer close(ch)
                    time.Sleep(1 * time.Second)
                    foo := &amp;Foo{Name: &quot;Foo&#039;s name&quot;}
                    ch &lt;- &amp;result{data: foo, err: nil}
                }()
                r := &lt;-ch
                return r.data, r.err
            },
        },
        &quot;concurrentFieldBar&quot;: &amp;graphql.Field{
            Type: FieldBarType,
            Resolve: func(p graphql.ResolveParams) (interface{}, error) {
                type result struct {
                    data interface{}
                    err  error
                }
                ch := make(chan *result, 1)
                go func() {
                    defer close(ch)
                    time.Sleep(1 * time.Second)
                    bar := &amp;Bar{Name: &quot;Bar&#039;s name&quot;}
                    ch &lt;- &amp;result{data: bar, err: nil}
                }()
                r := &lt;-ch
                return r.data, r.err
            },
        },
    },
})

func main() {
    schema, err := graphql.NewSchema(graphql.SchemaConfig{
        Query: QueryType,
    })
    if err != nil {
        log.Fatal(err)
    }
    query := `
        query {
            concurrentFieldFoo {
                name
            }
            concurrentFieldBar {
                name
            }
        }
    `
    result := graphql.Do(graphql.Params{
        RequestString: query,
        Schema:        schema,
    })
    b, err := json.Marshal(result)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf(&quot;%s&quot;, b)
    /*
        {
          &quot;data&quot;: {
            &quot;concurrentFieldBar&quot;: {
              &quot;name&quot;: &quot;Bar&#039;s name&quot;
            },
            &quot;concurrentFieldFoo&quot;: {
              &quot;name&quot;: &quot;Foo&#039;s name&quot;
            }
          }
        }
    */
}
</pre>

接著看看需要多少時間來完成執行

<pre class="brush: plain; title: ; notranslate">
$ time go run examples/concurrent-resolvers/main.go | jq
{
  &quot;data&quot;: {
    &quot;concurrentFieldBar&quot;: {
      &quot;name&quot;: &quot;Bar&#039;s name&quot;
    },
    &quot;concurrentFieldFoo&quot;: {
      &quot;name&quot;: &quot;Foo&#039;s name&quot;
    }
  }
}

real    0m4.186s
user    0m0.508s
sys     0m0.925s
</pre>

總共花費了四秒，原因是每個 resolver 都是依序執行，所以都需要等每個 goroutines 執行完成才能進入到下一個 resolver，上面例子該如何改成 Concurrent 呢，很簡單，只要將 return 的部分換成

<pre class="brush: go; title: ; notranslate">
                return func() (interface{}, error) {
                    r := &lt;-ch
                    return r.data, r.err
                }, nil
</pre>

執行時間如下

<pre class="brush: plain; title: ; notranslate">
$ time go run examples/concurrent-resolvers/main.go | jq
{
  &quot;data&quot;: {
    &quot;concurrentFieldBar&quot;: {
      &quot;name&quot;: &quot;Bar&#039;s name&quot;
    },
    &quot;concurrentFieldFoo&quot;: {
      &quot;name&quot;: &quot;Foo&#039;s name&quot;
    }
  }
}

real    0m1.499s
user    0m0.417s
sys     0m0.242s
</pre>

從原本的 4 秒多，變成 1.5 秒，原因就是兩個 resolver 的 goroutines 會同時執行，最後才拿結果。

<h2>心得</h2>

有了這功能後，比較複雜的 graphQL 語法，就可以用此方式加速執行時間。作者也用 Mogodb + graphql 寫了一個<a href="https://gist.github.com/chris-ramon/e90e245ae79d664ec2f22e4c5682ea3b">範例</a>，大家可以參考看看。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-7052" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/graphql-in-go/" class="wp_rp_title">Go 語言實戰 GraphQL</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-6963" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/02/simply-output-go-html-template-execution-to-strings/" class="wp_rp_title">將 Go Html Template 存入 String 變數</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7092" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/09/gofight-support-upload-file-testing/" class="wp_rp_title">gofight 支援檔案上傳測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-7047" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/mkcert-zero-config-tool-to-make-locally-trusted-development-certificates/" class="wp_rp_title">在本機端快速產生網站免費憑證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-7021" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/" class="wp_rp_title">如何在 Go 專案內寫測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6385" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/05/scaledrone-websocket-from-nodejs-to-go/" class="wp_rp_title">ScaleDrone Websocket 平台從 Node.js 轉換到 Golang</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="7" data-poid="in-6877" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/grpc-health-check-in-go/" class="wp_rp_title">Go 語言實現 gRPC Health 驗證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-7040" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/how-to-write-benchmark-in-go/" class="wp_rp_title">如何在 Go 語言內寫效能測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6634" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/01/new-git-code-hosting-option-gitea/" class="wp_rp_title">開發者另類的自架 Git 服務選擇: Gitea</a><small class="wp_rp_comments_count"> (4)</small><br /></li></ul></div></div>