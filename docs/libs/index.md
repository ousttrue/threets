# React + Three.js

本サイトでは React + Three.js の練習をします。
gh-pages にデプロイできる範囲の内容を扱います。

## 技術選定

関連して以下のような技術を選択しています

- Ladle. React Component 単位に実験できるので便利
- Docusaurus. Markdown でドキュメントを作るのに便利。Ladle で実験済みの部品を組込む予定
- R3F(React Three Fiber) React で three.js をするのに便利
- TweakPane. R3F 推しの Leva だとエラーになる場合があり回避方法がわからなかった

## Docusaurus 初期化

```sh
npx create-docusaurus@latest my-website classic --typescript
```

## ladle 初期化

```sh
npm install -D @ladle/react
npx ladle serve
╭────────────────────────────────────────────────────╮
│                                                    │
│   🥄 Ladle.dev served at http://localhost:61000/   │
│                                                    │
╰────────────────────────────────────────────────────╯
```

### ladle 設定

https://ladle.dev/docs/config

```js title=".ladle/config.mjs"
/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/threets/ladle/",
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  appendToHead:
    "<style>:root{--ladle-main-padding: 0;--ladle-main-padding-mobile: 0;}</style>",
};
```

### ladle の story

https://ladle.dev/docs/setup

```tsx title="/src/hello.stories.tsx"
export const World = () => <p>Hey!</p>;
```

## gh-pages へのデプロイ

- docusaurus を dist にビルド
- ladle を build にビルド
- mv build dist/ladle として ladle を合体
- dist をデプロイ

```yml title=".github/workflows/build.yml"
# https://ja.vitejs.dev/guide/static-deploy.html
# 静的コンテンツを GitHub Pages にデプロイするためのシンプルなワークフロー
name: ladle

on:
  push:
    branches:
      - master
  workflow_dispatch:

# GITHUB_TOKEN のパーミッションを設定し、GitHub Pages へのデプロイを許可します
permissions:
  contents: read
  pages: write
  id-token: write

# 1 つの同時デプロイメントを可能にする
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: build docusaurus
        run: npm run build
      - name: build ladle
        run: |
          npm run ladle:build
          mv build dist/ladle
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          # dist リポジトリのアップロード
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2```
