# aiq-coding-test

## セットアップ

[Docker](https://www.docker.com/ja-jp/)をインストールして、起動します。

次のコマンドでコンテナを作成し、開始します。

```
docker compose up
```

次に、nodeコンテナに接続します。

```
docker compose exec node bash
```

nodeコンテナに接続した後、依存関係をインストールします。

```
npm install
```

### 永続化されたデータの破棄

`down`コマンドに`--volume`オプションを付けることで、永続化されたデータを破棄することができます。

```
docker compose down --volume
```

## テストの実行

nodeコンテナに接続します。

```
docker compose exec node bash
```

次のコマンドでテストを実行することができます。

```
npm run test
```

## データのインポート

nodeコンテナに接続します。

```
docker compose exec node bash
```

CLIコマンドを実行することで、データベースに投稿データを登録することができます。

```
node cli/loadPosts.js /path/to/xxx.csv
```

※ データの初期化は実装されていません。新しくデータをインポートする場合は、手動でデータを削除してください。
※ CSVデータのフォーマット検証は実施していません。
