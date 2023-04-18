# 概要

Lambda 用地図 API

# デプロイ設定

## CodePipeline を作成

### Source

AWS CodeCommit を選択

### Build

AWS CodeBuild を選択  
[CodeBuild]-[環境変数] に以下を設定

- AWS_ACCOUNT_ID  
   AWS アカウント ID
- AWS_REGION  
   AWS リージョン名
- AWS_ECR_REP  
   ECR イメージ:タグ名
- AWS_LAMBDA  
   Lambda 関数名
