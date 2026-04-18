## タイトル
今更RSCについてお話する
Full RSC vs RSC as Data
Next.jsとTanStack Start比較

## なぜ今なのか
client side renderingを強く打ち出していたTanStackが、今週RSC対応を出してきた

RSC自体は新しくないが、
「RSCをアプリの中心に置くのか」
「RSCをデータの一種として扱うのか」
を比較しやすいタイミングになった

## React Server Componentとは
複雑、分かりづらいと呼ばれる諸悪の根源(嘘)

サーバー側でReactコンポーネントを評価して、その結果をクライアントへ送る仕組み

SSRみたいにHTMLを返すだけでもなく、
CSRみたいにJSONを返してブラウザで全部描くわけでもない

Reactのコンポーネントツリーを、Flightという仕組みでクライアントに渡して合成する

### メリット
サーバアクセスや秘匿性のあるデータをクライアントに持ってこなくてよい
ブラウザから直接APIを叩かないので、データ取得の経路を短くしやすい
必要なところだけclient componentに切り出せる

### デメリット
どこまでがserverでどこからがclientかを常に意識する必要がある
ブラウザ側の状態や副作用はclient componentに逃がす必要がある
インタラクティブなUIは結局client componentが必要

## 今日見たいこと
見た目のTODOアプリはかなり似る

でも思想の差はUIにはあまり出ない
差が出るのは、RSCを誰が責務として運ぶか

なので今回は実装コードだけではなく、
実際にブラウザへ送られているFlight payloadを比較する

ここを見ると

- Next.jsはRSCをApp Router全体のプロトコルとして運んでいる
- TanStack StartはRSCをrouter配下のdataとして運んでいる

という違いがかなりはっきり見える

## まず結論
Next.jsはFull RSC寄り
TanStack StartはRSC as Data寄り

どちらもRSCを使っているが、
何を主役にしているかが違う

## まずNext.jsのFlightを見る
Next.jsのHTMLレスポンスには、末尾に `self.__next_f.push(...)` が大量に入っている

この中に何が入っているかを見ると、
単に画面の断片だけではなく
App Router全体を動かすための情報まで一緒に運ばれている

実際に取れたレスポンスには、こういう断片がある

```text
self.__next_f.push([1,"7b:I[\"[project]/rsc_lt/next/app/todo-form.tsx ...\",\"TodoForm\"]"])
self.__next_f.push([1,"7e:I[\"[project]/rsc_lt/next/app/todo-item.tsx ...\",\"TodoItem\"]"])
```

まずここで、client component参照そのものがFlight payloadに入っている

さらにpage本体もそのまま入っている

```text
31:["$","main",null,{"className":"page-shell","children":[...]}]
```

しかもそれだけではなく、route treeやlayout側の情報まで入っている

```text
0:{"P":"$1","c":["",""],"q":"","i":true,"f":[[[["",{"children":["__PAGE__",{}]},...
```

つまりNext.jsでは、
RSCは「画面の一部のデータ」ではなく
App Routerの画面遷移、layout、client component参照を含めた
アプリ全体の仕組みとして運ばれている

### Next.jsの見え方
- pageの中身だけでなくroute treeごとFlightに乗る
- client component参照もFlightに乗る
- RSCがApp Routerの標準プロトコルになっている

### Next.jsの思想
今回のTODOアプリでも、
一覧取得はserver componentでやる
追加と更新はserver actionでやる
更新後は `revalidatePath('/')` で画面全体を再評価する

つまり
「RSCを使う」のではなく
「App Routerで書くとRSCが中心になる」
という世界観

## 次にTanStack StartのFlightを見る
TanStack StartのHTMLレスポンスには、 `$_TSR` と `$RSC` が埋め込まれている

ここを見ると、RSCはアプリ全体の基盤というより
loader dataの一部としてrouterに管理されている

実際のレスポンスにはこういう断片がある

```text
summary: $_TSR.t.get("$RSC")({kind:"renderable",stream: ...})
todoList: $_TSR.t.get("$RSC")({kind:"composite",stream: ..., slotUsagesStream: ...})
```

ここがかなり象徴的で、
RSCが `summary` や `todoList` というloader dataの値として入っている

つまりTanStack Startでは、
RSCはrouterが取得して保持するデータの一種

さらに `todoList` は `kind:"composite"` になっていて、
client側のslot利用も別ストリームで渡している

```text
$R[25].next({slot:"renderToggle",args:[{id:"t1",completed:false}]})
```

RSC本体側には `ClientSlot` が見えていて、
server側で作った木にclient側の差し込み口をあとから埋めている

```text
6:I["...ClientSlot...",[],"ClientSlot",1]
0:["$","ul",null,{"className":"todo-list","children":[
  ["$","li","t1",{"className":"todo-item","children":[
    ["$","span",null,{"className":"todo-title","children":"Read todos through a route loader"}],
    ["$","$L6",null,{"slot":"renderToggle","args":[{"id":"t1","completed":false}]}]
```

### TanStack Startの見え方
- RSCがloader dataの値として埋め込まれている
- `renderable` と `composite` でRSCの種類が分かれている
- slot利用は別ストリームでrouter側が管理している

### TanStack Startの思想
今回のTODOアプリでも、
route loaderの中でRSCを取得する
更新後は `router.invalidate()` でloader dataを取り直す

つまり主役はあくまでrouterで、
RSCはその管理下で使われるdataになっている

## Full RSC vs RSC as Data
ここが今日の一番言いたいところ

Next.jsは
RSCをアプリケーション全体のプロトコルとして運ぶ

だからpayloadを見ると、
page、layout、route tree、client component参照までまとめて乗っている

TanStack Startは
RSCをrouterが扱うdataとして運ぶ

だからpayloadを見ると、
`summary` や `todoList` というloader dataの中に
`$RSC` が値として入っている

同じTODOアプリでも、
更新後の処理が

- Next.js: `revalidatePath`
- TanStack Start: `router.invalidate()`

になっているのはかなり象徴的

Next.jsはアプリ全体をRSC前提で再評価する世界
TanStack Startはrouterがdataを取り直す世界

## どっちが良いのか
プロダクト開発で、
RSCを中心に素直に乗りたいならNext.jsはかなり強い

逆に、
router中心の設計を崩したくない
RSCをあくまで選べる表現のひとつとして使いたい
ならTanStack Startはかなり面白い

## オチ
UIは似るが、Flightは似ない

Next.jsはRSCをApp Routerの責務として運ぶ
TanStack StartはRSCをdata layerの責務として運ぶ

RSC比較で見るべきなのは、
対応しているかどうかではなく
RSCを誰が運んでいるか

この観点で見ると、
Next.jsはFull RSC
TanStack StartはRSC as Data

とかなり整理しやすいと思います
