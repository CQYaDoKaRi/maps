# 概要
docker によりサービスを起動制御します  
- Node.js  
- MongoDB  
- Mongo Express  
- Redis  
# 起動
```
./init.sh
```
- docker image 作成（作成済みの場合は削除して再作成）  
- docker コンテナ起動  
- MongoDB 起動  
- Mongo Express 起動  
- Redis 起動  
- Node.js 起動(PM2, ts-node, ts-node-dev)  

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

# Node.js コンテナにログインして PM2(node) を起動
```
./docker init.sh exec_start
```

# Node.js コンテナにログインして ts-node を起動
```
./docker init.sh exec_start_tsn
```

# Node.js コンテナにログインして ts-node-dev を起動
```
./docker init.sh exec_start_tsndev
```
