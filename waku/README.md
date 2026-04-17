# Waku RSC Plan

## Position

Waku は RSC 中心の軽量な比較対象です。Next.js より薄い抽象化で、RSC そのものの感触を比較しやすい前提があります。

## Implementation Policy

1. RSC を中心に page/component を組み立てる
2. ルーティングより component tree 側の責務分割を優先する
3. データ取得は server component に寄せて、必要最小限の client island を置く
4. mutation は framework が提供する server 側の入口に合わせて比較する
5. streaming と素の React Server Components に近い感触を観察する

## What To Verify

- RSC を薄く扱える分、構成の自由度が高すぎないか
- Next.js にある統合機能がない場合の設計負荷
- 小さな構成での学習コストと説明のしやすさ
- 実運用で必要な周辺機能の補完コスト

## Suggested Initial Structure

```text
waku/
  src/
    pages/articles.tsx
    pages/article-detail.tsx
    components/like-button.tsx
    server/articles.ts
```
