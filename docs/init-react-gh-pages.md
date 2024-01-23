# Ladle + React + gh-pages

## 初期化

```sh
npm init -y
npm install -D @ladle/react
npx ladle serve
╭────────────────────────────────────────────────────╮
│                                                    │
│   🥄 Ladle.dev served at http://localhost:61000/   │
│                                                    │
╰────────────────────────────────────────────────────╯
```

速い。`npm create @vite/latest` よりも手軽な気がする。

## tsx

https://ladle.dev/docs/setup

`/src/hello.stories.tsx`

```tsx
export const World = () => <p>Hey!</p>;
```

## mdx

`/src/init.stories.mdx`

mdx も追加インストールや設定せずに動きます。

https://ladle.dev/docs/mdx

## .ladle/config.mjs

https://ladle.dev/docs/config

```js
/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/threets/",
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  defaultStory: "index--readme",
  storyOrder: ["index--readme", "hello--World"],
};
```
## gh-pages

```yml
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
      - name: build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          # dist リポジトリのアップロード
          path: './build'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```
