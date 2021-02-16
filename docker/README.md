# 概要
docker によりサービスを起動制御します  
- Node.js
- MongoDB
- Mongo Express 

# 起動
```
./init.sh
```
- docker image 作成（作成済みの場合は削除して再作成）
- docker コンテナ起動
- MongoDB 起動
- Mongo Express 起動
- Node.js 起動

# 停止
```
./init.sh stop
```
- 起動した docker コンテナ停止
- 生成した docker image 削除

# Node.js コンテナにログイン
```
./docker init.sh exec
```

# Node.js コンテナにログインして node を起動
ts-node 起動  
```
./docker init.sh exec_run
```

# Node.js コンテナにログインして node を起動（開発モード）
ts-node-dev 起動  
```
./docker init.sh exec_run_dev
```
