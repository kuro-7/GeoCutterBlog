# GeoCutter Blog

microCMS 公式のシンプルなブログテンプレートを基にした GeoCutter 公式ブログです。

## 採用元

このリポジトリは [microCMS 公式 Next.js シンプルブログテンプレート](https://github.com/microcmsio/nextjs-simple-blog-template)
を次のコミットから利用しています。

```text
2268ac5215244db7891c3d2bcb6571e0ff79210c
```

upstream の履歴は変更せず、更新は固定コミットを確認してから手動で行います。
ライセンスは MIT です。詳細は [LICENSE](LICENSE) を参照してください。

## 動作環境

Node.js 24 以上

## 環境変数の設定

ルート直下に`.env.local`ファイルを作成し、下記の情報を入力してください。

```
MICROCMS_API_KEY=xxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx
```

`MICROCMS_API_KEY`  
microCMS 管理画面の「サービス設定 > API キー」から確認することができます。

`MICROCMS_SERVICE_DOMAIN`  
microCMS 管理画面の URL（https://xxxxxxxx.microcms.io）の xxxxxxxx の部分です。

## 開発の仕方

1. パッケージのインストール

```bash
npm ci
```

2. 開発環境の起動

```bash
npm run dev
```

3. テストと build

```bash
npm run test
npm run build
```

4. 開発環境へのアクセス
   [http://localhost:3000/blog](http://localhost:3000/blog)にアクセス

## Cloudflare 構成

production Workerは`geocutter-blog`、stagingは`geocutter-blog-staging`、routeはそれぞれ`geocutter.com/blog*`と`staging.geocutter.com/blog*`です。Blog WorkerにR2、Images、D1、KV、Queuesのbindingは付けません。
API keyは`.env.local`とWorker secretにだけ置き、Git、`wrangler.jsonc`、`NEXT_PUBLIC_*`、ブラウザ、R2 metadataには置きません。
## microCMS schema

`microcms-template.json`をschema mirrorとして、microCMS Hobbyに次の3 APIを手動作成します。画像はmedia fieldにせず、R2公開URLのtext fieldに保存します。

`writers`: `name` text必須、`profile` textArea必須、`imageUrl`/`imageAlt` text任意。`tags`: `name` text必須。`blog`: `title` text必須、`description`/`body` textArea必須、`thumbnailUrl`/`thumbnailAlt` text必須、`tags` tagsへのrelationList必須、`writer` writersへのrelation必須。

`imageUrl`と`imageAlt`は両方入力するか両方空にします。初期writerは、content ID `geocutter-official`、name `GeoCutter公式`、profile `人口で地図を切る地理パズルゲーム「GeoCutter」の公式ブログです。遊び方、攻略、地理・人口データを紹介します。`、画像URL/alt空、status公開です。

記事の content ID がそのまま `/blog/articles/<content-id>` の slug になります。

## 画面プレビューの設定

ブログAPIの「API設定 > 画面プレビュー」には`https://staging.geocutter.com/blog/articles/{CONTENT_ID}?dk={DRAFT_KEY}`を設定します。

production URLは使わず、`DRAFT_KEY`はGit、チャット通常ログ、スクリーンショット、テスト結果へ保存しません。

このリポジトリの `.npmrc` は security 設定を含むため、変更・削除しません。
