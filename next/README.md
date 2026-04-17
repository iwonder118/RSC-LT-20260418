# Next.js RSC Plan

## Position

Next.js は App Router を通して RSC を標準経路として扱えます。比較対象の中では、RSC を最も素直に採用しやすい前提です。

## Implementation Policy

1. `app/` 配下で route segment 単位に server component を置く
2. 一覧・詳細のデータ取得は server component で直接実行する
3. interactive な部品だけ `use client` を付けて分離する
4. 作成・更新は server actions を優先して比較する
5. streaming は `loading.tsx` と `Suspense` で観察する

## What To Verify

- server action の書き味と型の流れ
- fetch cache / revalidate の理解コスト
- route segment と component boundary の対応の分かりやすさ
- RSC を前提にした資料量と ecosystem の厚さ

## Suggested Initial Structure

```text
next/
  app/
    articles/page.tsx
    articles/[id]/page.tsx
    articles/new/actions.ts
    components/like-button.tsx
```
