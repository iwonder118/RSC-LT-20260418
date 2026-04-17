# RSC LT Comparison

`next`、`tanstack_start`、`waku` を並べて、React Server Components の実装方針を比較するためのワークスペースです。

## Directory Layout

- `next/`: Next.js App Router を前提にした RSC 実装方針
- `tanstack_start/`: TanStack Start を前提にしたサーバー境界とデータ取得方針
- `waku/`: Waku を前提にした最小構成の RSC 実装方針

## Comparison Axes

1. ルーティングとサーバー境界をどう定義するか
2. データ取得を RSC 内に寄せるか、loader/action と分離するか
3. mutation をどの API に寄せるか
4. streaming / suspense をどこまで素直に扱えるか
5. deploy 制約とランタイム要件

## Recommended Evaluation Flow

1. 同じユースケースを 3 実装にそろえる
2. `server component`, `client component`, `mutation entrypoint` を同じ粒度で置く
3. 開発体験、境界の明快さ、キャッシュ戦略、将来の保守コストを比較する

## Shared Scenario

比較対象の最小ユースケースは次を想定します。

- 記事一覧をサーバーで取得して表示する
- 記事詳細をストリーミング可能にする
- `Like` ボタンだけを client component にする
- 記事作成を server action または同等機構で処理する

各ディレクトリの `README.md` に、フレームワークごとの実装方針をまとめています。

## Run Side By Side

別ターミナルで次を実行すると、3 つを同時に確認できます。

```bash
npm run dev:next
npm run dev:tanstack
npm run dev:waku
```

- Next.js: `http://127.0.0.1:3000`
- TanStack Start: `http://127.0.0.1:3001`
- Waku: `http://127.0.0.1:3002`

LT 用の比較メモは `docs/lt-rsc-notes.md` にあります。
