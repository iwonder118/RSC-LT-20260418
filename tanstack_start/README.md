# TanStack Start RSC Plan

## Position

TanStack Start は router / loader / server function 由来の考え方を持ちながら、現在は RSC を experimental 機能として扱っています。比較対象としては「RSC をクライアントファーストの設計にどう乗せるか」を見る対象です。

## Implementation Policy

1. file-based routing を基準に画面境界を決める
2. route loader から `createServerFn` 経由で RSC を取得する
3. `renderServerComponent` または `createCompositeComponent` を使って server/client 合成を比較する
4. mutation は引き続き server function を基準に比較する
5. suspense / streaming は router cache と組み合わせて評価する

## What To Verify

- route loader と RSC fetch の責務分担が明快か
- RSC を「画面の土台」ではなく「取得するデータ」として扱う感触
- full-stack type safety と boundary 設計のバランス
- TanStack Router / Query 資産との整合性

## Suggested Initial Structure

```text
tanstack_start/
  app/
    routes/index.tsx
    server/todos.ts
    components/like-button.tsx
```
