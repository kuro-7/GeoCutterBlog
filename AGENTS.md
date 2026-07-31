# GeoCutterBlog 作業ガイド

このリポジトリは `GeoCutter` から分離した公式ブログです。ブログ固有の仕様はこのリポジトリの
README と、親リポジトリの実装指示書を正本として確認します。

## 作業規約

- 作業ブランチは `dev` とし、`main` へ直接 commit しない。
- 各 Phase は Sol の承認後に区切りよく commit し、push はユーザーが明示したときだけ行う。
- 変更前後に `git status`、`git diff --check`、対象テスト、build を確認する。
- Node.js 24.x と npm 11.x を使い、`.npmrc` の security 設定を変更しない。
- `.env.local`、`.dev.vars`、API key、draft key は commit、ログ、画面出力へ残さない。
- Cloudflare、microCMS、R2 の外部状態を変更する前にユーザーの承認を得る。

## 検証

```powershell
npm ci
npm run test
npm run build
```

OpenNext の preview と deploy は WSL2 または Linux で実行します。production deploy と GeoCutterWeb
の変更は別タスクです。Phase の指定がある場合は、指定されたファイルと検証だけを実施し、commit 前に
staged diff を確認して停止します。
