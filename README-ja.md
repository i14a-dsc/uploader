# Uploader

シンプルで高速なローカルネットワーク用ファイル共有アプリケーション

## 概要

Uploaderは、ローカルネットワーク内でのファイル共有を簡単に行うためのWebアプリケーションです。ブラウザからアクセスするだけで、ファイルのアップロード、ダウンロード、共有が簡単に行えます。

レスポンシブデザインに対応しており、パソコン、タブレット、スマートフォンなど、さまざまなデバイスから快適に利用できます。

## 機能

- **ファイルアップロード**: ドラッグ＆ドロップまたはファイル選択ダイアログを使用してファイルをアップロード
- **ファイル管理**: アップロードしたファイルの一覧表示、削除、名前変更などの操作
- **ファイル共有**: URLを共有してファイルを他のユーザーと共有
- **ファイルプレビュー**: ブラウザでサポートされているファイル形式はプレビュー可能
- **レスポンシブデザイン**: スマートフォンからデスクトップまで、様々な画面サイズに対応

## インストール方法

### 前提条件

- Node.js (v18以上)
- Bun@^1.1.43 (ts-nodeを使用しない場合のビルドに必要)

### インストール手順

1. リポジトリをクローンします：

```bash
git clone https://github.com/i14a-dsc/uploader.git
cd uploader
```

2. 依存パッケージをインストールします：

```bash
bun install
```

または

```bash
node install
```

3. アプリケーションを起動します：

```bash
bun start
```

または

インストール/アップデートする度に

```bash
bun run build
```

してから

```bash
node start:node
```

4. ブラウザで http://localhost:8081 にアクセスしてアプリケーションを使用します。

## 使用方法

### ホーム画面

ホーム画面では、最近アップロードされたファイルの一覧が表示されます。「Upload Files」ボタンをクリックしてファイルをアップロードするか、「Browse Files」ボタンをクリックして全てのファイルを表示できます。

### ファイルのアップロード

「Upload」ページでは、ファイルをドラッグ＆ドロップするか、「Choose Files」ボタンをクリックしてファイルを選択できます。

### ファイルの管理

「Files」ページでは、アップロードされた全てのファイルが一覧表示されます。各ファイルに対して以下の操作が可能です：

- **プレビュー**: ファイルをブラウザで開いて表示
- **ダウンロード**: ファイルをデバイスにダウンロード
- **共有**: ファイルの共有URLを表示
- **名前変更**: ファイル名を変更
- **削除**: ファイルを削除

## カスタマイズ

### ポート番号の変更

デフォルトではポート8081で起動しますが、`src/server.ts`ファイルの`port`変数を編集することで変更できます。

### ファイル保存先の変更

ファイルは`files`ディレクトリに保存されます。保存先を変更するには、`src/server.ts`ファイルの関連するパスを変更してください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 貢献

バグ報告や機能リクエストは、GitHubのIssueページからお願いします。プルリクエストも歓迎しています。 

注: これらの文章はAIによって丁寧な言葉にしてもらってます