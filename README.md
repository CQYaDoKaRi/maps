# 概要
- ２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める
- ズームレベルから縮尺を求める
- 緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める
- GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示

# 使用技術
## 環境
- Node.js(ts-node, ts-node-dev) + Express.js
- docker
- gulp + tsc + babel + webpack
- eslint
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
	ts-node 起動  
	```
	./start.sh www
	```

- docker コンテナの Node.js のみ起動する（開発モード）  
	ts-node-dev 起動  
	```
	./start.sh www_dev
	```

- Node.js のみ起動  
	docker コンテナを使わない＝ docker コンテナが停止している状態で動作します  
	Node.js の実行するホスト名が docker コンテナのホスト名 [maps] でない場合、  
	docker コンテナにより動作する MongoDB に関係する処理のみ機能させずに起動します  
	- ts-node
		```
		npm run start
		```
		= `npm run ts-node --project ./tsconfig.node.json src/node/index.ts`

	- ts-node-dev
		```
		npm run startdev
		```
		= `npm run-dev ts-node --project ./tsconfig.node.json src/node/index.ts`

	- node（トランスパイル済み js）
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

# MongoDB
## Collection
- pref  
	都道府県界データ（Polygon）  
	- 元データ：GeoJSON  
		https://japonyol.net/editor/article/prefectures.geojson  

- prefCity  
	市区町村界データ（Polygon）  
	- 元データ：GeoJSON  
		https://www.esrij.com/products/japan-shp/  

- prefCapital  
	都道府県庁データ（Point）  
	- 元データ：TypeScript  
		src/ts/mapsDataPrefCapital.ts

- postOffice  
	郵便局データ（Point）  
	- 元データ：GeoJSON  
		https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P30.html  

- roadsiteStation  
	道の駅データ（Point）  
	- 元データ：GeoJSON  
		https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P35.html  