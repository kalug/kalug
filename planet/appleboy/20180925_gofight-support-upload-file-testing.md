---
title: "gofight 支援多個檔案上傳測試"
date: 2018-09-25
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/09/gofight-support-upload-file-testing/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/40093179410/in/dateposted-public/" title="Go-Logo_Blue"><img src="https://i1.wp.com/farm1.staticflickr.com/908/40093179410_53df4bb9e8_z.jpg?w=840&#038;ssl=1" alt="Go-Logo_Blue" data-recalc-dims="1" /></a>

<a href="https://github.com/appleboy/gofight">gofight</a> 是一套用 <a href="https://golang.org">Go 語言</a>撰寫的 HTTP API 測試套件，之前已經寫過<a href="https://blog.wu-boy.com/2016/04/gofight-tool-for-api-handler-testing-in-golang/">一篇介紹用法</a>，當時候尚未支援檔案上傳測試，也就是假設寫了一個<a href="https://github.com/gin-gonic/gin/#upload-files">檔案上傳的 http handler</a> 在專案內如何寫測試，底下來看看該如何使用。

<span id="more-7092"></span>

<h2>準備環境</h2>

首先需要一個測試檔案，通常會在專案底下建立 <code>testdata</code> 目錄，裡面放置一個叫 <code>hello.txt</code> 檔案，內容為 <code>world</code>。接著安裝 <code>gofight</code> 套件，可以用團隊內喜愛的 vendor 工具，我個人偏好 <a href="https://github.com/kardianos/govendor">govendor</a>：

<pre class="brush: plain; title: ; notranslate">
$ govendor fetch github.com/kardianos/govendor
或
$ go get -u github.com/kardianos/govendor
</pre>

<h2>檔案上傳範例</h2>

這邊用 <a href="https://github.com/gin-gonic/gin">gin</a> 框架當作範例，如果您用其他框架只要支援 <code>http.HandlerFunc</code> 都可以使用。

<pre class="brush: go; title: ; notranslate">
func gintFileUploadHandler(c *gin.Context) {
    ip := c.ClientIP()
    hello, err := c.FormFile(&quot;hello&quot;)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            &quot;error&quot;: err.Error(),
        })
        return
    }

    helloFile, _ := hello.Open()
    helloBytes := make([]byte, 6)
    helloFile.Read(helloBytes)

    world, err := c.FormFile(&quot;world&quot;)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            &quot;error&quot;: err.Error(),
        })
        return
    }

    worldFile, _ := world.Open()
    worldBytes := make([]byte, 6)
    worldFile.Read(worldBytes)

    foo := c.PostForm(&quot;foo&quot;)
    bar := c.PostForm(&quot;bar&quot;)
    c.JSON(http.StatusOK, gin.H{
        &quot;hello&quot;:     hello.Filename,
        &quot;world&quot;:     world.Filename,
        &quot;foo&quot;:       foo,
        &quot;bar&quot;:       bar,
        &quot;ip&quot;:        ip,
        &quot;helloSize&quot;: string(helloBytes),
        &quot;worldSize&quot;: string(worldBytes),
    })
}

// GinEngine is gin router.
func GinEngine() *gin.Engine {
    gin.SetMode(gin.TestMode)
    r := gin.New()
    r.POST(&quot;/upload&quot;, gintFileUploadHandler)

    return r
}
</pre>

上面例子可以發現，測試端需要傳兩個 post 參數，加上一個檔案 (檔名為 test)，底下看看 gofight 怎麼寫測試。

<h2>檔案上傳測試</h2>

gofight 現在支援一個函式叫 <code>SetFileFromPath</code> 此 func 支援兩個參數。

<ol>
<li>上傳檔案格式</li>
<li>POST 參數</li>
</ol>

第一項上傳檔案格式，可以是從實體路徑讀取，或者是透過 <code>[]byte</code> 讀取兩種格式都可以，在 gofight 可以看到 <code>UploadFile</code> struct 如下:

<pre class="brush: go; title: ; notranslate">
// UploadFile for upload file struct
type UploadFile struct {
    Path    string
    Name    string
    Content []byte
}
</pre>

假設是透過實體路徑上傳，請在 <code>Path</code> 填上實體路徑名稱，例如: <code>./testdata/hello.txt</code>，而 <code>Name</code> 則是在 Gin 裡面接受的 Upload File 名稱 <code>c.FormFile("hello")</code>，其中的 <code>hello</code> 參數。底下是一個實際例子教大家如何上傳多個檔案測試。

<pre class="brush: go; title: ; notranslate">
func TestUploadFile(t *testing.T) {
    r := New()

    r.POST(&quot;/upload&quot;).
        SetDebug(true).
        SetFileFromPath([]UploadFile{
            {
                Path: &quot;./testdata/hello.txt&quot;,
                Name: &quot;hello&quot;,
            },
            {
                Path: &quot;./testdata/world.txt&quot;,
                Name: &quot;world&quot;,
            },
        }, H{
            &quot;foo&quot;: &quot;bar&quot;,
            &quot;bar&quot;: &quot;foo&quot;,
        }).
        Run(framework.GinEngine(), func(r HTTPResponse, rq HTTPRequest) {
            data := []byte(r.Body.String())

            hello := gjson.GetBytes(data, &quot;hello&quot;)
            world := gjson.GetBytes(data, &quot;world&quot;)
            foo := gjson.GetBytes(data, &quot;foo&quot;)
            bar := gjson.GetBytes(data, &quot;bar&quot;)
            ip := gjson.GetBytes(data, &quot;ip&quot;)
            helloSize := gjson.GetBytes(data, &quot;helloSize&quot;)
            worldSize := gjson.GetBytes(data, &quot;worldSize&quot;)

            assert.Equal(t, &quot;world\n&quot;, helloSize.String())
            assert.Equal(t, &quot;hello\n&quot;, worldSize.String())
            assert.Equal(t, &quot;hello.txt&quot;, hello.String())
            assert.Equal(t, &quot;world.txt&quot;, world.String())
            assert.Equal(t, &quot;bar&quot;, foo.String())
            assert.Equal(t, &quot;foo&quot;, bar.String())
            assert.Equal(t, &quot;&quot;, ip.String())
            assert.Equal(t, http.StatusOK, r.Code)
            assert.Equal(t, &quot;application/json; charset=utf-8&quot;, r.HeaderMap.Get(&quot;Content-Type&quot;))
        })
}
</pre>

假設專案內有使用 <a href="https://github.com/avelino/awesome-go#resource-embedding">Resource Embedding</a> 像是 <a href="https://github.com/UnnoTed/fileb0x">fileb0x</a>，就可以透過設定 <code>Content</code> 方式來讀取喔，要注意的是，由於不是從實體路徑讀取，所以 <code>Path</code> 請直接放檔案名稱即可。測試程式碼如下:

<pre class="brush: go; title: ; notranslate">
    r := New()

    helloContent, err := ioutil.ReadFile(&quot;./testdata/hello.txt&quot;)
    if err != nil {
        log.Fatal(err)
    }

    worldContent, err := ioutil.ReadFile(&quot;./testdata/world.txt&quot;)
    if err != nil {
        log.Fatal(err)
    }

    r.POST(&quot;/upload&quot;).
        SetDebug(true).
        SetFileFromPath([]UploadFile{
            {
                Path:    &quot;hello.txt&quot;,
                Name:    &quot;hello&quot;,
                Content: helloContent,
            },
            {
                Path:    &quot;world.txt&quot;,
                Name:    &quot;world&quot;,
                Content: worldContent,
            },
        }, H{
            &quot;foo&quot;: &quot;bar&quot;,
            &quot;bar&quot;: &quot;foo&quot;,
        }).
        Run(framework.GinEngine(), func(r HTTPResponse, rq HTTPRequest) {
            data := []byte(r.Body.String())

            hello := gjson.GetBytes(data, &quot;hello&quot;)
            world := gjson.GetBytes(data, &quot;world&quot;)
            foo := gjson.GetBytes(data, &quot;foo&quot;)
            bar := gjson.GetBytes(data, &quot;bar&quot;)
            ip := gjson.GetBytes(data, &quot;ip&quot;)
            helloSize := gjson.GetBytes(data, &quot;helloSize&quot;)
            worldSize := gjson.GetBytes(data, &quot;worldSize&quot;)

            assert.Equal(t, &quot;world\n&quot;, helloSize.String())
            assert.Equal(t, &quot;hello\n&quot;, worldSize.String())
            assert.Equal(t, &quot;hello.txt&quot;, hello.String())
            assert.Equal(t, &quot;world.txt&quot;, world.String())
            assert.Equal(t, &quot;bar&quot;, foo.String())
            assert.Equal(t, &quot;foo&quot;, bar.String())
            assert.Equal(t, &quot;&quot;, ip.String())
            assert.Equal(t, http.StatusOK, r.Code)
            assert.Equal(t, &quot;application/json; charset=utf-8&quot;, r.HeaderMap.Get(&quot;Content-Type&quot;))
        })
</pre>

<h2>心得</h2>

其實這類測試 HTTP Handler API 的套件相當多，當時就自幹一套當作練習，後來每個 Go 專案，我個人都用自己寫的這套，測試起來相當方便。更多詳細的用法請直接看 <a href="https://github.com/appleboy/gofight">gofight 文件</a>。對於 Go 語言有興趣的朋友們，可以直接參考我的<a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-TOP">線上課程</a>。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6597" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/11/golang-gofight-support-echo-framework/" class="wp_rp_title">輕量級 Gofight 支援 Echo 框架測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6198" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/04/gofight-tool-for-api-handler-testing-in-golang/" class="wp_rp_title">用 gofight 來測試 golang web API handler</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="2" data-poid="in-7021" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/" class="wp_rp_title">如何在 Go 專案內寫測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7052" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/graphql-in-go/" class="wp_rp_title">Go 語言實戰 GraphQL</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6674" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/golang-dependency-management-tool-dep/" class="wp_rp_title">Go 語言官方推出的 dep 使用心得</a><small class="wp_rp_comments_count"> (6)</small><br /></li><li data-position="5" data-poid="in-6481" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/08/golang-tesing-on-jenkins/" class="wp_rp_title">在 Jenkins 跑 Golang 測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6953" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/01/write-golang-in-aws-lambda/" class="wp_rp_title">在 AWS Lambda 上寫 Go 語言搭配 API Gateway</a><small class="wp_rp_comments_count"> (3)</small><br /></li><li data-position="7" data-poid="in-6772" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/07/go-framework-gin-release-v1-2/" class="wp_rp_title">Go 語言框架 Gin 終於發佈 v1.2 版本</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="8" data-poid="in-7047" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/07/mkcert-zero-config-tool-to-make-locally-trusted-development-certificates/" class="wp_rp_title">在本機端快速產生網站免費憑證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="9" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>