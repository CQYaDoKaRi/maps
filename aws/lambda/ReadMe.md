# 概要
Lambda 用地図API

# 設定
init.env.sh を作成し 以下の内容のファイルを作成する
```
APP="ローカル環境のアプリメーション名"
APPTAG="ローカル環境のアプリケーションタグ"
AWS_ACCOUNT_ID="AWS アカウントID"
AWS_REGION="AWS リージョン"
AWS_ECR_REP="ERCレポジトリ名:タグ"
```

# インストール
```
npm install
```

# 開始
```
./init
```

# ビルド＆開始
```
./init start
```

# 停止
```
./init stop
```

# テスト
```
./init test
 ```

 # AWS ECR へ push
```
./init ecr
```

 # AWS CodeCommit 用のソース生成
```
./init make
```
`src.codecommit` フォルダーが生成される