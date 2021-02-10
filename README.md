# 概要
- ２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める
- ズームレベルから縮尺を求める
- 緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める
- GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示

# 使用技術
## 環境
- Node.js(ts-node) + Express.js
- docker
- gulp + tsc + babel + webpack
## 言語
- TypeScript + React
- JavaScript(ES2015)
- SCSS
- HTML5
- Swagger(OpenAPI v3)
- ShellScript(bash)
## ライブラリー
- leaflet
- Char.js
## テスト
- Jest(ts-jest)
- Cypress
## データベース
- MongoDB
- Mongo Express

# インストール
```
npm install
```

# ビルド
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

# ビルド - 開発モード(TypeScript)
```
build.sh dev
```
- gulp + tsc
	- TypeScript を tsconfig.json の設定でコンパイルして出力[./dist/public]
- gulp + uglify
	- tsc でコンパイルした JavaScript[./dist/public/js/app.js] を圧縮して出力[./public/js/appp.min.js]
- gulp + tsc
	- TypeScript のファイルを監視しコンパイル

# 起動
docker コンテナで Node.js、MongoDB, Mongo Express を起動します  
```
./start.sh
```

- docker コンテナの Node.js のみ起動する
	```
	./start.sh www
	```

- docker コンテナを使わないで Node.js のみ起動（ts-node）
	```
	npm run start
	```
	= npm run ts-node --project ./tsconfig.node.json src/node/index.ts

- docker コンテナを使わないで Node.js のみ起動（トランスパイル済み js）
	```
	node dist/node/node/index.js
	```

# サイト表示
- メインページ  
	http://localhost:8080/  

- メインページ（開発モード）  
	http://localhost:8080/index.html?dev=1  

- API  
	http://localhost:8080/api/maps/docs/  

- Mongo Express  
	http://localhost:8581/  

# テスト
- JEST
	```
	npm run test
	```

- Cypress - GUI
	```
	npx cypress open
	```

- Cypress - CUI
	```
	npx cypress run
	```