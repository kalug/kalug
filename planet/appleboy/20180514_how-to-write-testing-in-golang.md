---
title: "如何在 Go 專案內寫測試"
date: 2018-05-14
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/24407557644/in/dateposted-public/" title="Go-brown-side.sh"><img src="https://i1.wp.com/farm2.staticflickr.com/1622/24407557644_36087ca6de.jpg?w=840&#038;ssl=1" alt="Go-brown-side.sh" data-recalc-dims="1" /></a>

相信大家都知道專案內不導入測試，未來越來越多功能，技術債就會越來越多，接手的人罵聲連連，而寫測試的簡單與否決定專案初期是否要先導入。為什麼專案要導入測試，導入測試有什麼好處，對於團隊而言，導入測試好處實在太多了，底下列了幾點是我個人覺得非常重要的。

<ol>
<li>減少 Review 時間</li>
<li>降低修改程式碼產生的的錯誤</li>
<li>確保程式碼品質</li>
</ol>

第一點非常實用，尤其在專案很忙的時候，同事間只有少許的時間可以幫忙看程式碼或討論，如果大家都有寫測試，在時間的壓力下，只要稍微看一下，CI/CD 驗證過無誤，大致上就可以上線了。第二點在於，團隊其他成員需要修改一個不確定的地方，商業邏輯修正可能會造成很大的錯誤，而測試在這時候就發揮效果。最後一點就是程式碼品質，不管是新功能，或者是 Bug，任何時間點都需要補上測試，就算 code coverage 已經很高了，但是只要有任何 bug 就要補測試，測試寫的越多，專案的品質相對會提高。在 Go 語言專案內該如何寫測試了，為什麼專案要導入 Go 語言的原因之一就是『寫測試太簡單』了，底下來介紹如何寫基本的測試。

<span id="more-7021"></span>

<h2>內建 testing 套件</h2>

在 Go 語言內，不需要而外安裝任何第三方套件就可以開使寫測試，首先該將測試放在哪個目錄內呢？不需要建立特定目錄來存放測試程式碼，而是針對每個 Go 的原始檔案，建立一個全新測試檔案，並且檔名最後加上 <code>_test</code> 就可以了，假設程式碼為 <code>car.go</code> 那麼測試程式就是 <code>car_test.go</code>，底下舉個<a href="https://github.com/go-training/training/blob/79ae76dd120c39949d99b4fcb69d692880200ad4/example18-write-testing-and-doc/car.go#L1">範例</a>

<pre class="brush: go; title: ; notranslate">
package car

import &quot;errors&quot;

// Car struct
type Car struct {
    Name  string
    Price float32
}

// SetName set car name
func (c *Car) SetName(name string) string {
    if name != &quot;&quot; {
        c.Name = name
    }

    return c.Name
}

// New Object
func New(name string, price float32) (*Car, error) {
    if name == &quot;&quot; {
        return nil, errors.New(&quot;missing name&quot;)
    }

    return &amp;Car{
        Name:  name,
        Price: price,
    }, nil
}
</pre>

驗證上面的程式碼可以建立 <code>car_test.go</code>，並且寫下<a href="https://github.com/go-training/training/blob/79ae76dd120c39949d99b4fcb69d692880200ad4/example18-write-testing-and-doc/car_test.go#L9-L19">第一個測試程式</a>：

<pre class="brush: go; title: ; notranslate">
// Simple testing what different between Fatal and Error
func TestNew(t *testing.T) {
    c, err := New(&quot;&quot;, 100)
    if err != nil {
        t.Fatal(&quot;got errors:&quot;, err)
    }

    if c == nil {
        t.Error(&quot;car should be nil&quot;)
    }
}
</pre>

首先 func 名稱一定要以 <code>Test</code> 作為開頭，而 Go 內建 testing 套件，可以使用簡易的 t.Fatal 或 t.Error 來驗證錯誤，這兩個的差異在於 t.Fatal 會中斷測試，而 t.Error 不會，簡單來說，假設您需要整個完整測試後才顯示錯誤，那就需要用 t.Error，反之就使用 t.Fatal 來中斷測試。

<h2>使用 testify 套件</h2>

這邊只會介紹一個第三方套件那就是 <a href="https://github.com/stretchr/testify">testify</a>，裡面內建很多好用的測試等大家發掘，底下用簡單的 assert 套件來修改上方的<a href="https://github.com/go-training/training/blob/26970ef05d9cb438b0522f961493863b3628d0c2/example18-write-testing-and-doc/car_test.go#L21-L33">測試程式</a>:

<pre class="brush: go; title: ; notranslate">
func TestNewWithAssert(t *testing.T) {
    c, err := New(&quot;&quot;, 100)
    assert.NotNil(t, err)
    assert.Error(t, err)
    assert.Nil(t, c)

    c, err = New(&quot;foo&quot;, 100)
    assert.Nil(t, err)
    assert.NoError(t, err)
    assert.NotNil(t, c)
    assert.Equal(t, &quot;foo&quot;, c.Name)
}
</pre>

有沒有看起來比較簡潔。這邊測試用的 command，也可以針對單一函式做測試。

<pre class="brush: plain; title: ; notranslate">
$ go test -v -run=TestNewWithAssert ./example18-write-testing-and-doc/...
</pre>

可以看到 <code>-run</code> 讓開發者可以針對單一函式做測試，對於大型專案來說非常方便，假設修正完 bug，並且寫了測試，就可以針對單一函式做測試，這點 Go 做得相當棒。

<h2>平行測試</h2>

講平行測試之前，跟大家講個用 vscode 編輯器寫測試的一個小技巧，就是透過 vscode 可以幫忙產生測試程式碼，該如何使用呢？可以先將要測試的函式全選，然後按下 <code>command</code> + <code>shift</code> + <code>p</code>，就會出現底下命令列選擇。

<a href="https://www.flickr.com/photos/appleboy/42094339161/in/dateposted-public/" title="Snip20180514_2"><img src="https://i1.wp.com/farm1.staticflickr.com/830/42094339161_964d38f4cf_z.jpg?w=840&#038;ssl=1" alt="Snip20180514_2" data-recalc-dims="1" /></a>

這邊為什麼要平行測試呢？原因是單一函式測試，假設一個情境需要執行時間為 0.5 秒，那麼假設寫了 10 種狀況，就需要 10 * 0.5 秒，這樣花費太久了。這時候就需要請 Go 幫忙做平行測試。先看看底下範例:

<pre class="brush: go; title: ; notranslate">
func TestCar_SetName(t *testing.T) {
    type fields struct {
        Name  string
        Price float32
    }
    type args struct {
        name string
    }
    tests := []struct {
        name   string
        fields fields
        args   args
        want   string
    }{
        {
            name: &quot;no input name&quot;,
            fields: fields{
                Name:  &quot;foo&quot;,
                Price: 100,
            },
            args: args{
                name: &quot;&quot;,
            },
            want: &quot;foo&quot;,
        },
        {
            name: &quot;input name&quot;,
            fields: fields{
                Name:  &quot;foo&quot;,
                Price: 100,
            },
            args: args{
                name: &quot;bar&quot;,
            },
            want: &quot;bar&quot;,
        },
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            c := &amp;Car{
                Name:  tt.fields.Name,
                Price: tt.fields.Price,
            }
            if got := c.SetName(tt.args.name); got != tt.want {
                t.Errorf(&quot;Car.SetName() = %v, want %v&quot;, got, tt.want)
            }
        })
    }
}
</pre>

上面範例跑了兩個測試，一個是沒有 input value，一個則是有 input，根據 for 迴圈會依序執行測試，其中裡面的 <code>t.Run</code> 是指 sub test，如下圖

<a href="https://www.flickr.com/photos/appleboy/41375173154/in/dateposted-public/" title="Snip20180514_3"><img src="https://i1.wp.com/farm1.staticflickr.com/962/41375173154_b9bb7bd422_z.jpg?w=840&#038;ssl=1" alt="Snip20180514_3" data-recalc-dims="1" /></a>

上述的程式碼都是 vscode 幫忙產生的，開發者只需要把測試資料補上就可以了。假設有 10 個情境需要測試，那該如何讓 Go 幫忙平行測試呢？請使用 <code>t.Parallel()</code>

<pre class="brush: go; title: ; notranslate">
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()
            c := &amp;Car{
                Name:  tt.fields.Name,
                Price: tt.fields.Price,
            }
            if got := c.SetName(tt.args.name); got != tt.want {
                t.Errorf(&quot;Car.SetName() = %v, want %v&quot;, got, tt.want)
            }
        })
    }
</pre>

在 <code>t.Run</code> 的 callback 測試內補上 <code>t.Parallel()</code> 就可以了喔。寫到這邊，大家應該可以看出一個問題，就是平行測試的內容怎麼都會是測試同一個情境，也就是本來要測試 10 種情境，但是會發現 Go 把最後一個情境同時跑了 10 次？這邊的問題點出在哪邊，請大家注意 <code>tt</code> 變數，由於跑平行測試，那麼 for 迴圈最後一次就會蓋掉之前的所有 tt 變數，要修正此狀況也非常容易，在迴圈內重新宣告一次即可 <code>tt := tt</code>

<pre class="brush: go; title: ; notranslate">
    for _, tt := range tests {
        tt := tt
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()
            c := &amp;Car{
                Name:  tt.fields.Name,
                Price: tt.fields.Price,
            }
            if got := c.SetName(tt.args.name); got != tt.want {
                t.Errorf(&quot;Car.SetName() = %v, want %v&quot;, got, tt.want)
            }
        })
    }
</pre>

<h2>感想</h2>

本篇尚未寫到『整合性測試』也就是該如何搭配 Database 進行資料庫測試，會在開新的一篇做介紹。本文內容也有錄製影片放在 Udemy 上面，如果覺得寫的不錯，也可以參考我的教學影片。

<h1><a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-INTRO">直接購買線上影片</a></h1>
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6671" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/" class="wp_rp_title">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="1" data-poid="in-6721" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/" class="wp_rp_title">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="2" data-poid="in-6869" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/" class="wp_rp_title">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="3" data-poid="in-6963" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/02/simply-output-go-html-template-execution-to-strings/" class="wp_rp_title">將 Go Html Template 存入 String 變數</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6452" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/07/new-coverage-service-codecov-io/" class="wp_rp_title">新的 code coverage 線上服務 codecov.io</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6982" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/docker-healthcheck-in-golang/" class="wp_rp_title">Go 語言搭配 Docker Healthy Check 檢查</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6877" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/11/grpc-health-check-in-go/" class="wp_rp_title">Go 語言實現 gRPC Health 驗證</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="7" data-poid="in-7013" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/04/init-func-in-golang/" class="wp_rp_title">Go 語言的 init 函式</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="8" data-poid="in-6198" data-post-type="none" ><a href="https://blog.wu-boy.com/2016/04/gofight-tool-for-api-handler-testing-in-golang/" class="wp_rp_title">用 gofight 來測試 golang web API handler</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li data-position="9" data-poid="in-6791" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/microservice-in-go/" class="wp_rp_title">用 Go 語言打造微服務架構</a><small class="wp_rp_comments_count"> (0)</small><br /></li></ul></div></div>