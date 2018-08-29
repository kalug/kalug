---
title: "如何在 Go 語言內寫效能測試"
date: 2018-06-26
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/06/how-to-write-benchmark-in-go/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/24407557644/in/dateposted-public/" title="Go-brown-side.sh"><img src="https://i1.wp.com/farm2.staticflickr.com/1622/24407557644_36087ca6de.jpg?w=840&#038;ssl=1" alt="Go-brown-side.sh" data-recalc-dims="1" /></a>

<a href="https://golang.org/">Go 語言</a>不只有內建基本的 <a href="https://golang.org/pkg/testing/">Testing</a> 功能，另外也內建了 <a href="https://golang.org/pkg/testing/#hdr-Benchmarks">Benchmark</a> 工具，讓開發者可以快速的驗證自己寫的程式碼效能如何？該如何使用基本的 Benchmark 工具，底下用簡單的例子來說明如何寫 Benchmark，透過內建工具可以知道程式碼單次執行多少時間，以及用了多少記憶體。不多說直接用『數字轉字串』來當例子。

<span id="more-7040"></span>

<h2>線上影片</h2>

如果您不想看底下的文字說明，可以直接參考線上影片教學：

<iframe width="560" height="315" src="https://www.youtube.com/embed/o7hwuzHzt8M" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

另外我在 Udemy 上面開了兩門課程，一門 drone 另一門 golang 教學，如果對這兩門課有興趣的話，都可以購買，目前都是特價 $1800

<ul>
<li><a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-TOP">Go 語言實戰</a> $1800</li>
<li><a href="https://www.udemy.com/devops-oneday/?couponCode=DRONE-DEVOPS">一天學會 DEVOPS 自動化流程</a> $1800</li>
</ul>

如果兩們都有興趣想一起合買，請直接匯款到下面帳戶，特價 <strong>$3000</strong>

<ul>
<li>富邦銀行: 012</li>
<li>富邦帳號: 746168268370</li>
<li>匯款金額: 台幣 $3000 元</li>
</ul>

<h2>如何寫 Benchmark</h2>

建立 <code>main_test.go</code> 檔案

<pre class="brush: go; title: ; notranslate">
func BenchmarkPrintInt2String01(b *testing.B) {
    for i := 0; i &lt; b.N; i++ {
        printInt2String01(100)
    }
}
</pre>

<ul>
<li>檔案名稱一定要用 <code>_test.go</code> 當結尾</li>
<li>func 名稱開頭要用 <code>Benchmark</code></li>
<li>for 循環內要放置要測試的程式碼</li>
<li>b.N 是 go 語言內建提供的循環，根據一秒鐘的時間計算</li>
<li>跟測試不同的是帶入 <code>b *testing.B</code> 參數</li>
</ul>

底下是測試指令:

<pre class="brush: plain; title: ; notranslate">
$ go test -v -bench=. -run=none .
goos: darwin
goarch: amd64
BenchmarkPrintInt2String01-4    10000000               140 ns/op
PASS
</pre>

基本的 benchmark 測試也是透過 <code>go test</code> 指令，不同的是要加上 <code>-bench=.</code>，這樣才會跑 benchmark 部分，否則預設只有跑測試程式，大家可以看到 <code>-4</code> 代表目前的 CPU 核心數，也就是 <code>GOMAXPROCS</code> 的值，另外 <code>-run</code> 可以用在跑特定的測試函示，但是假設沒有指定 <code>-run</code> 時，你會看到預設跑測試 + benchmark，所以這邊補上 <code>-run=none</code> 的用意是不要跑任何測試，只有跑 benchmark，最後看看輸出結果，其中 <code>10000000</code> 代表一秒鐘可以跑 1000 萬次，每一次需要 <code>140 ns</code>，如果你想跑兩秒，請加上此參數在命令列 <code>-benchtime=2s</code>，但是個人覺得沒什麼意義。

<h2>效能比較</h2>

底下直接看看『數字轉字串』效能評估，參考底下寫出三種數字轉字串函式，<a href="https://github.com/go-training/training/blob/26838fcdfaa49e2c5e1b893c84498a5f28c2e7ac/example20-write-benchmark/main.go#L8-L23">線上程式碼</a>

<pre class="brush: go; title: ; notranslate">
func printInt2String01(num int) string {
    return fmt.Sprintf(&quot;%d&quot;, num)
}

func printInt2String02(num int64) string {
    return strconv.FormatInt(num, 10)
}
func printInt2String03(num int) string {
    return strconv.Itoa(num)
}
</pre>

接著寫 benchmark，<a href="https://github.com/go-training/training/blob/26838fcdfaa49e2c5e1b893c84498a5f28c2e7ac/example20-write-benchmark/main_test.go#L23-L39">線上程式碼</a>

<pre class="brush: go; title: ; notranslate">
func BenchmarkPrintInt2String01(b *testing.B) {
    for i := 0; i &lt; b.N; i++ {
        printInt2String01(100)
    }
}

func BenchmarkPrintInt2String02(b *testing.B) {
    for i := 0; i &lt; b.N; i++ {
        printInt2String02(int64(100))
    }
}

func BenchmarkPrintInt2String03(b *testing.B) {
    for i := 0; i &lt; b.N; i++ {
        printInt2String03(100)
    }
}
</pre>

跑測試

<pre class="brush: plain; title: ; notranslate">
$ go test -v -bench=. -run=none -benchmem .
goos: darwin
goarch: amd64
BenchmarkPrintInt2String01-4    10000000               125 ns/op              16 B/op          2 allocs/op
BenchmarkPrintInt2String02-4    30000000                37.8 ns/op             3 B/op          1 allocs/op
BenchmarkPrintInt2String03-4    30000000                38.6 ns/op             3 B/op          1 allocs/op
PASS
ok      _/Users/mtk10671/git/go/src/github.com/go-training/training/example20-write-benchmark   3.800s
</pre>

可以很清楚看到使用 <code>strconv.FormatInt</code> 效能是最好的。透過 <code>-benchmem</code> 可以清楚知道記憶體分配方式，用此方式就可以知道要優化哪些函示。<code>1 allocs/op</code> 代表每次執行都需要搭配一個記憶體空間，而一個記憶體空間為 <code>3 Bytes</code>。
<div class="wp_rp_wrap  wp_rp_plain" ><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li data-position="0" data-poid="in-6721" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/05/go-struct-method-pointer-or-value/" class="wp_rp_title">Go 語言內 struct methods 該使用 pointer 或 value 傳值?</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="1" data-poid="in-6992" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/03/golang-introduction-video/" class="wp_rp_title">Go 語言基礎實戰教學影片上線了</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="2" data-poid="in-7021" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/05/how-to-write-testing-in-golang/" class="wp_rp_title">如何在 Go 專案內寫測試</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="3" data-poid="in-7029" data-post-type="none" ><a href="https://blog.wu-boy.com/2018/06/drone-kubernetes-with-golang/" class="wp_rp_title">Drone 搭配 Kubernetes 部署 Go 語言項目</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="4" data-poid="in-6708" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/devops-bot-in-golang/" class="wp_rp_title">用 Go 語言打造 DevOps Bot</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="5" data-poid="in-6791" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/08/microservice-in-go/" class="wp_rp_title">用 Go 語言打造微服務架構</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li data-position="6" data-poid="in-6634" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/01/new-git-code-hosting-option-gitea/" class="wp_rp_title">開發者另類的自架 Git 服務選擇: Gitea</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="7" data-poid="in-6758" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/06/gopher-day-in-taipei/" class="wp_rp_title">台灣第一屆 GoPher 大會</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li data-position="8" data-poid="in-6657" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/02/caddy-setting-with-drone-ci-server/" class="wp_rp_title">Caddy 搭配 Drone 伺服器設定</a><small class="wp_rp_comments_count"> (4)</small><br /></li><li data-position="9" data-poid="in-6690" data-post-type="none" ><a href="https://blog.wu-boy.com/2017/04/5-reasons-why-we-switched-from-python-to-go/" class="wp_rp_title">五大理由從 Python 轉到 Go 語言</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>