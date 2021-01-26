# 概要
- ２地点間の距離を求める
- ある地点から角度と距離を指定して地点を求める
- ズームレベルと縮尺
- 緯度経度からタイル情報を取得し、タイル左上原点の緯度経度を求める
- 緯度経度からタイル情報を取得し、タイル左上原点の緯度経度と標高タイルから標高値を求める
- Garamin の GPS ログデータ（GPX）を読み込んでグラフ表示

## インストール
```
npm install
```

## ビルド
```
build.sh
```
- gulp + tsc
	- TypeScript を tsconfig.json の設定でコンパイルして出力[./dist/public]
	- TypeScript を tsconfig.node.json の設定でコンパイル[./dist/node]
- gulp + babel
	- tsc でコンパイルした JavaScript[./dist/public] を変換して出力[./dist/public.babel]
- gulp + webpack
	- babel で変換した JavaScript[./dist/public.babel] を結合・圧縮して出力[./public/js]
- gulp + uglify
	- tsc でコンパイルした JavaScript[./dist/public/js/app.js] を圧縮して出力[./public/js/appp.min.js]
- gulp + sass
	- scss をコンパイル、結合、圧縮して出力[./public/css]

## ビルド - 開発モード(TypeScript)
```
build.sh dev
```
- gulp + tsc
	- TypeScript を tsconfig.json の設定でコンパイルして出力[./dist/public]
- gulp + uglify
	- tsc でコンパイルした JavaScript[./dist/public/js/app.js] を圧縮して出力[./public/js/appp.min.js]
- gulp + tsc
	- TypeScript のファイルを監視しコンパイル

## 起動 - ts-node
```
npm run start
```
= npm run ts-node --project ./tsconfig.node.json src/node/index.ts

## 起動 - node
```
node dist/node/node/index.js
```

## docker - 起動
```
./docker/init.sh start
```
- docker image 作成
- docker コンテナ起動
- node 起動

## docker - 停止
```
./docker/init.sh stop
```
- docker コンテナ停止
- docker image 削除

## docker - コンテナログイン
```
./docker init.sh exec
```

## 表示
http://localhost:8080/  

## 表示 - 開発モード
http://localhost:8080/index.html?dev=1  
minify 前のファイルを使う  

## テスト - JEST
```
npm run test
```

## テスト - Cypress - GUI
```
npx cypress open
```

## テスト - Cypress - CUI
```
npx cypress run
```