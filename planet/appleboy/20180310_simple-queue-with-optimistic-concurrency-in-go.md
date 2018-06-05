---
title: "用 Go 語言實現單一或多重 Queue 搭配 optimistic concurrency"
date: 2018-03-10
type: blog
author: AppleBoy
link: https://blog.wu-boy.com/2018/03/simple-queue-with-optimistic-concurrency-in-go/
layout: post
comments: true
---

<a href="https://www.flickr.com/photos/appleboy/25850362427/in/dateposted-public/" title="Screen Shot 2018-03-10 at 3.22.59 PM"><img alt="Screen Shot 2018-03-10 at 3.22.59 PM" src="https://i2.wp.com/farm5.staticflickr.com/4781/25850362427_fb8199a5ee_z.jpg?w=840&#038;ssl=1" /></a>

本篇教學會著重在如何使用 Go 語言的 <a href="https://gobyexample.com/goroutines">goroutine</a> 及 <a href="https://gobyexample.com/channels">channel</a>。<a href="https://www.mongodb.com/">MongoDB</a> 是一套具有高效能讀寫的 NoSQL 資料庫，但是不像傳統關連式資料庫，有非常好用的 Transaction 交易模式，而在 MongoDB 也可以透過 <a href="https://docs.mongodb.com/manual/tutorial/perform-two-phase-commits/">Two Phase Commits</a> 來達成交易功能，大家可以先打開文件看看，非常冗長，工程師需要花很多時間閱讀文件並且實現出來。而在 <a href="https://golang.org">Go 語言</a>內，我們可以在 Single Thread 內同一時間點讀寫存取同一筆資料庫來解決此問題。此篇作法只適合運作在單一 application，如果是執行多個 application 則需要透過其他方式來解決，像是 <a href="https://en.wikipedia.org/wiki/Optimistic_concurrency_control">Optimistic concurrency control</a>。

<span id="more-6966"></span>

<h2>問題描述</h2>



<hr />

底下步驟來產生資料

<ol>
<li>建立使用者，並且初始化每人 $1000 USD</li>
<li>接到新的交易請求</li>
<li>讀取使用者帳戶剩餘存款</li>
<li>將該帳號增加 $50 USD</li>
</ol>

根據上述的需求，我們可以知道，當有 100 個連線交易時，理論上該使用者的存款會變成 $1000 + $50*100 = $6000 USD。這是理想狀態，假設如果同時間打上來，大家可以知道最後存款肯定不到 $6000。底下程式碼可以複製出此問題

<pre class="brush: go; title: ; notranslate">
func main() {
    session, _ := mgo.Dial("localhost:27017")
    globalDB = session.DB("queue")
    globalDB.C("bank").DropCollection()

    user := currency{Account: account, Amount: 1000.00, Code: "USD"}
    err := globalDB.C("bank").Insert(&amp;user)

    if err != nil {
        panic("insert error")
    }

    log.Println("Listen server on 8000 port")
    http.HandleFunc("/", pay)
    http.ListenAndServe(":8000", nil)
}
</pre>

上述是主程式，新增一個 Handle 為 pay，用來處理交易。

<pre class="brush: go; title: ; notranslate">
func pay(w http.ResponseWriter, r *http.Request) {
    entry := currency{}
    // step 1: get current amount
    err := globalDB.C("bank").Find(bson.M{"account": account}).One(&amp;entry)

    if err != nil {
        panic(err)
    }

    wait := Random(1, 100)
    time.Sleep(time.Duration(wait) * time.Millisecond)

    //step 3: subtract current balance and update back to database
    entry.Amount = entry.Amount + 50.000
    err = globalDB.C("bank").UpdateId(entry.ID, &amp;entry)

    if err != nil {
        panic("update error")
    }

    fmt.Printf("%+v\n", entry)

    io.WriteString(w, "ok")
}
</pre>

<h2>解決方式</h2>

這邊提供幾個解決方式，第一種就是透過 <code>sync.Mutex</code> 方式，直接將交易區段程式碼 lock 住，這樣可以避免同時寫入或讀出的問題。在 Handler 內直接新增底下程式碼就可以解決，詳細程式碼請參考 <a href="https://github.com/go-training/go-transaction-example/blob/master/safe/safe.go">safe.go</a>

<pre class="brush: go; title: ; notranslate">
    mu.Lock()
    defer mu.Unlock()
</pre>

第二種方式可以用 Go 語言內的優勢: <a href="https://gobyexample.com/goroutines">goroutine</a> + <a href="https://gobyexample.com/channels">channel</a>，在這邊我們只要建立兩個 Channle，第一個是使用者帳號 (string) 第二個是輸出 Result (struct)。<a href="https://github.com/go-training/go-transaction-example/blob/master/queue/single_queue.go">完整程式碼範例</a>

<pre class="brush: go; title: ; notranslate">
    in = make(chan string)
    out = make(chan Result)
</pre>

在 main func 內建立第一個 goroutine

<pre class="brush: go; title: ; notranslate">
    go func(in *chan string) {
        for {
            select {
            case account := &lt;-*in:
                entry := currency{}
                // step 1: get current amount
                err := globalDB.C("bank").Find(bson.M{"account": account}).One(&amp;entry)

                if err != nil {
                    panic(err)
                }

                //step 3: subtract current balance and update back to database
                entry.Amount = entry.Amount + 50.000
                err = globalDB.C("bank").UpdateId(entry.ID, &amp;entry)

                if err != nil {
                    panic("update error")
                }

                out &lt;- Result{
                    Account: account,
                    Result:  entry.Amount,
                }
            }
        }

    }(&amp;in)
</pre>

上面可以很清楚看到使用到 <code>select</code> 來接受 input channel，並且透過 <code>go</code> 將 for loop 丟到背景執行。所以在每個交易時，將帳號丟到 <code>in</code> channel 內，就可以開始進行交易，同時間並不會有其他交易。在 handler 內，也是透過此方式來讀取使用者最後存款餘額

<pre class="brush: go; title: ; notranslate">
    wg := sync.WaitGroup{}
    wg.Add(1)

    go func(wg *sync.WaitGroup) {
        in &lt;- account
        for {
            select {
            case result := &lt;-out:
                fmt.Printf("%+v\n", result)
                wg.Done()
                return
            }
        }
    }(&amp;wg)

    wg.Wait()
</pre>

不過上面這方法，可想而知，只有一個 Queue 幫忙處理交易資料，那假設有幾百萬個交易要同時進行呢，該如何消化更多的交易，就要將上面程式碼改成 Multiple Queue <a href="https://github.com/go-training/go-transaction-example/blob/master/multiple_queue/multiple_queue.go">完整程式碼範例</a>。假設我們有 100 個帳號，開 10 個 Queue 去處理，每一個 Queue 來處理 10 個帳號，也就是說 ID 為 23 號的分給第 3 (23 % 10) 個 Queue，ID 為 59 號則分給第 9 個 Queue。

<pre class="brush: go; title: ; notranslate">
    for i := range in {
        go func(in *chan string, i int) {
            for {
                select {
                case account := &lt;-*in:
                    out<em></em> &lt;- Result{
                        Account: account,
                        Result:  entry.Amount,
                    }
                }
            }

        }(&amp;in<em></em>, i)
    }
</pre>

其中 channel 要宣告為底下: maxThread 為 10 (可以由開發者任意設定)

<pre class="brush: go; title: ; notranslate">
    in = make([]chan string, maxThread)
    out = make([]chan Result, maxThread)
</pre>

<h2>Optimistic concurrency control</h2>

假設需要擴展服務，執行超過一個服務，就會遇到 <a href="https://en.wikipedia.org/wiki/Optimistic_concurrency_control">Optimistic concurrency control</a>，原因在上述方法只能保證在單一服務內不會同時存取同一筆資料，但是如果是多個服務則還是會發生同時存取或寫入單筆資料。這邊可以用簡單的機制來解決應用層的問題，直接在資料表加上 <code>Version</code>，初始值為 <code>1</code>，要執行更新時請透過底下語法來更新:

<pre class="brush: go; title: ; notranslate">
    entry.Amount = entry.Amount + 50.000
    err = globalDB.C("bank").Update(bson.M{
        "version": entry.Version,
        "_id":     entry.ID,
    }, bson.M{"$set": map[string]interface{}{
        "amount":  entry.Amount,
        "version": (entry.Version + 1),
    }})

    if err != nil {
        goto LOOP
    }
</pre>

如果資料不存在時，就無法寫入，這樣可以避免同時寫入問題。

<h2>效能測試</h2>

上述提供了幾種解決方式，但是該選擇哪一種會比較好呢，底下是透過 [vegeta] http 效能檢測工具來實驗看看，底下先整理結果

<ol>
<li>使用 sync.Mutex</li>
<li>使用 single queue</li>
<li>使用 multiple queue</li>
<li>使用 optimistic concurrency 解決方案</li>
<li>使用 single queue + optimistic concurrency 解決方案</li>
<li>使用 multiple queue + optimistic concurrency 解決方案</li>
</ol>

直接給數據看看

<table>
<thead>
<tr>
  <th></th>
  <th>max Latencies</th>
  <th>mean Latencies</th>
  <th>user account</th>
</tr>
</thead>
<tbody>
<tr>
  <td>sync lock</td>
  <td>26.250468944s</td>
  <td>13.171447347s</td>
  <td>1</td>
</tr>
<tr>
  <td>optimistic lock</td>
  <td>5.016707396s</td>
  <td>1.903748023s</td>
  <td>1</td>
</tr>
<tr>
  <td>single queue</td>
  <td>66.078117ms</td>
  <td>763.662µs</td>
  <td>1</td>
</tr>
<tr>
  <td>multiple queue</td>
  <td>49.270982ms</td>
  <td>789.131µs</td>
  <td>100</td>
</tr>
<tr>
  <td>optimistic single queue</td>
  <td>139.045488ms</td>
  <td>1.297197ms</td>
  <td>1</td>
</tr>
<tr>
  <td>optimistic multiple queue</td>
  <td>51.268963ms</td>
  <td>924.951µs</td>
  <td>100</td>
</tr>
</tbody>
</table>

如果只需要執行單一服務，可以選擇 <code>multiple queue</code>，這不是最好的解法，要執行多個服務，請務必使用 <code>optimistic multiple queue</code>

<h2>結論</h2>

詳細的程式碼都有放在 <a href="https://github.com/go-training/go-transaction-example">go-transaction-example</a>，歡迎大家拿去測試看看。最後宣傳一下自己最近開的 <a href="https://www.udemy.com/golang-fight/?couponCode=GOLANG-INTRO">Go 語言課程</a>，限時特價 <strong>$1600</strong> 如果想趁這機會踏入 Go 語言，可以透過此線上課程學到基礎實戰，包含本片的的影音教學。
<div class="wp_rp_wrap  wp_rp_plain"><div class="wp_rp_content"><h3 class="related_post_title">Related View</h3><ul class="related_post wp_rp"><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/11/gorush-a-push-notification-server-written-in-go/">Gorush 輕量級手機訊息發送服務</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/04/build-minimal-docker-container-using-multi-stage-for-go-app/">用 Docker Multi-Stage 編譯出 Go 語言最小 Image</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/03/error-handler-in-golang/">Go 語言的錯誤訊息處理</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/10/go-configuration-with-viper/">在 Go 語言使用 Viper 管理設定檔</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/04/5-reasons-why-we-switched-from-python-to-go/">五大理由從 Python 轉到 Go 語言</a><small class="wp_rp_comments_count"> (1)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/05/sourcegraph-chrome-extension-for-github/">在 Github 專案內搜尋 Golang 函式，Golang 開發者必裝 Chrome Extension</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2016/11/send-line-notification-using-docker-written-in-golang/">用 Docker 發送 Line 訊息</a><small class="wp_rp_comments_count"> (5)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/01/business-benefits-of-go/">從商業利益看 Go 程式語言</a><small class="wp_rp_comments_count"> (2)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2018/02/simply-output-go-html-template-execution-to-strings/">將 Go Html Template 存入 String 變數</a><small class="wp_rp_comments_count"> (0)</small><br /></li><li><a class="wp_rp_title" href="https://blog.wu-boy.com/2017/04/1-line-letsencrypt-https-servers-in-golang/">在 Go 語言用一行程式碼自動化安裝且更新 Let’s Encrypt 憑證</a><small class="wp_rp_comments_count"> (1)</small><br /></li></ul></div></div>