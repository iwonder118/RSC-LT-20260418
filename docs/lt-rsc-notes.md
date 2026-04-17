# LT Notes: Reading The RSC Payload

このメモは、各アプリを dev 起動した状態で初回レスポンスを見たときの比較用ノートです。

## Startup

```bash
npm run dev:next
npm run dev:tanstack
npm run dev:waku
```

## 1. Next.js

### What You See In The HTML

- HTML の末尾に `self.__next_f.push(...)` が並ぶ
- `I[...]` で client component の参照が列挙される
- RSC payload の中に page tree と props がまとまって入る

### Example Markers

```text
self.__next_f.push([1,"7b:I[\".../next/app/todo-form.tsx ...\",\"TodoForm\"]"])
self.__next_f.push([1,"7e:I[\".../next/app/todo-item.tsx ...\",\"TodoItem\"]"])
self.__next_f.push([1,"31:[\"$\",\"main\",null,{\"className\":\"page-shell\" ... }]"])
```

### LT Framing

- Next.js は RSC を router / layout / metadata と統合した「アプリ全体のプロトコル」として持っている
- Flight payload の中に route tree と client reference がかなり濃く出る
- `app/` と server actions を使うと、RSC が実装の中心になる

## 2. TanStack Start

### What You See In The HTML

- HTML の中で `$_TSR` と `$R["tsr"]` が初期化される
- loader data の一部として `$RSC` オブジェクトが埋め込まれる
- `renderable` と `composite` で RSC の扱いが分かれている

### Example Markers

```text
summary: $_TSR.t.get("$RSC")({ kind:"renderable", stream: ... })
todoList: $_TSR.t.get("$RSC")({ kind:"composite", stream: ..., slotUsagesStream: ... })
$R[25].next({slot:"renderToggle",args:[{id:"t1",completed:false}]})
```

### LT Framing

- TanStack Start は RSC を「route loader が受け取るデータ」の一種として扱う
- 画面全体を RSC に寄せるというより、router 主導の世界に RSC を差し込む思想が見える
- `CompositeComponent` の slot は、server 側の木に client 側の穴をあとから埋める感触が強い

## 3. Waku

### What You See In The HTML

- `globalThis.__WAKU_PREFETCHED__` と `self.__FLIGHT_DATA.push(...)` が入る
- root の prefetched response として Flight stream を持つ
- page/layout と client reference が比較的そのまま露出する

### Example Markers

```text
globalThis.__WAKU_PREFETCHED__ = { "R/_root": ... }
(self.__FLIGHT_DATA||=[]).push("16:I[\"...waku/router/client...\",\"ErrorBoundary\",1]")
(self.__FLIGHT_DATA||=[]).push("2d:I[\"/src/components/todo-form.tsx...\",\"TodoForm\",1]")
```

### LT Framing

- Waku は RSC/Flight を薄く前面に出していて、payload も React と framework glue の距離が近い
- Next.js より抽象化が少なく、TanStack Start より router に支配されていない
- そのぶん「何を自分で決めるか」が増える

## 4. One-Slide Summary

- Next.js: RSC がアプリの標準実装面
- TanStack Start: RSC は router/data layer に組み込まれる拡張機能
- Waku: RSC を薄く直接扱うミニマルな土台

## 5. Suggested Talk Track

1. 3 つとも TODO 自体は似ているが、RSC payload の置き方が違う
2. Next.js は `__next_f` で route tree ごと運ぶ
3. TanStack Start は loader が `$RSC` を保持し、router がそれを管理する
4. Waku は `__FLIGHT_DATA` をかなり素直に流している
5. つまり差は UI ではなく、RSC を誰の責務で運ぶかにある
