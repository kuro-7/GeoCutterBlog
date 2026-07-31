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
BASE_URL=http://localhost:3000
```

`MICROCMS_API_KEY`  
microCMS 管理画面の「サービス設定 > API キー」から確認することができます。

`MICROCMS_SERVICE_DOMAIN`  
microCMS 管理画面の URL（https://xxxxxxxx.microcms.io）の xxxxxxxx の部分です。

`BASE_URL`
デプロイ先の URL です。プロトコルから記載してください。

例）  
開発環境 → http://localhost:3000  
本番環境 → https://geocutter.com/blog

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

## 画面プレビューの設定

下書き状態のコンテンツをプレビューするために、microCMS管理画面にて画面プレビューの設定が必要です。

ブログAPIの「API設定 > 画面プレビュー」に下記のように設定してください。  
※`your-domain`部分はデプロイ先のドメインに置き換えてください。（localhost指定でも動作します）

![blog-preview](https://github.com/microcmsio/nextjs-simple-blog-template/assets/4659294/5045ac9e-3699-47b4-8927-4187114d75bd)

設定後はコンテンツ編集画面にて画面プレビューボタンが利用可能になります。

## Cloudflare 構成

- production Worker は `geocutter-blog`、staging は `geocutter-blog-staging` です。
- production route は `geocutter.com/blog*`、staging route は `staging.geocutter.com/blog*` です。
- Blog Worker に R2、Images、D1、KV、Queues の binding は付けません。
- API key は `.env.local` または Worker secret にだけ設定します。

## Node.js のバージョンについて

このテンプレートは **Node.js 24 以上**を前提としています。

Node.js では定期的にセキュリティアップデートが提供されています。  
安全にご利用いただくため、Node.js を利用する際は
**利用中のメジャーバージョン（例: 24.x）の最新パッチバージョンを使用することを推奨します。**

最新のセキュリティ情報については、以下をご参照ください。
https://nodejs.org/ja/blog/vulnerability/

## このテンプレートに含まれる `.npmrc` について

このテンプレートには、npm の `min-release-age` と `registry` 設定を有効にするための `.npmrc` ファイルが含まれています。

```ini
min-release-age=7
registry=https://npm.flatt.tech
```

`min-release-age` はサプライチェーン攻撃対策の一環として設定しているもので、公開から7日未満の npm パッケージバージョンをインストール対象から除外します。これにより、悪意のあるパッケージや改ざんされたパッケージが公開直後に利用されるリスクを軽減できます。

`registry` はレジストリを [Takumi Guard](https://flatt.tech/takumi/features/guard)（GMO Flatt Security が提供する npm セキュリティプロキシ）に向けるもので、`npm install` 時にパッケージを既知の脅威データベースと照合し、悪意のあるパッケージのインストールをブロックします。トークンなしの匿名利用で有効になり、追加の設定は不要です。この設定はローカルだけでなく、GitHub Actions や Dependabot による依存更新にも適用されます。

プロジェクトの要件や運用方針に応じて、これらの値を変更したり、設定を削除したりすることも可能です。
