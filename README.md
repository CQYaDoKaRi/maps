# 概要
- ２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める
- ズームレベルから縮尺を求める
- 緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める
- GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示

# 使用技術
## 環境
- [Node.js](https://nodejs.org/ja/) (ts-node, ts-node-dev)  
	+ [Redux](https://redux.js.org/)  
	+ [React](https://ja.reactjs.org/)  
	+ [Express.js](https://expressjs.com/ja/)  
	+ [Next.js](https://nextjs.org/)  
	+ [PM2](https://pm2.keymetrics.io/)  
- [docker](https://www.docker.com/)  
	+ [docker-compose](https://docs.docker.com/compose/)  
- [gulp](https://gulpjs.com/)  
	+ [prettier](https://prettier.io/)  
	+ [eslint](https://eslint.org/)  
	+ [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html)  
	+ [babel](https://babeljs.io/)  
	+ [webpack](https://webpack.js.org/)  
- [husky](https://github.com/typicode/husky)  
- [lint-staged](https://github.com/okonet/lint-staged)  
## 言語
- [HTML5](https://dev.w3.org/html5/spec-LC/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [JavaScript](https://www.typescriptlang.org/) (ES2015)  
- [SCSS](https://sass-lang.com/)  
- [Swagger](https://swagger.io/) (OpenAPI v3)  
- [ShellScript-bash](https://www.gnu.org/software/bash/)  
## ライブラリー
- [leaflet](https://leafletjs.com/)  
- [Char.js](https://www.chartjs.org/)  
## テスト
- [Jest](https://jestjs.io/ja/) (ts-jest)  
- [Cypress](https://www.cypress.io/)  
## データベース
- [MongoDB](https://www.mongodb.com/)  
- [Mongo Express](https://github.com/mongo-express)  

# インストール
```
npm install
```

# ビルド
```
build.sh
```
- gulp + prettier  
	- [./src] のソースファイルを自動整形して保存  
- gulp + eslint  
	- [./src] のソースファイルを構文チェック  
- gulp + tsc  
	- TypeScript を tsconfig.json の設定でコンパイルして出力 [./dist/public]  
	- TypeScript を tsconfig.node.json の設定でコンパイル [./dist/node]  
- gulp + babel  
	- tsc でコンパイルした JavaScript[./dist/public] を変換して出力 [./dist/public.babel]  
- gulp + webpack  
	- babel で変換した JavaScript[./dist/public.babel] を結合・圧縮して出力 [./public/js]  
- gulp + uglify  
	- tsc でコンパイルした JavaScript[./dist/public/js/app.js] を圧縮して出力 [./public/js/appp.min.js]  
- gulp + sass  
	- scss をコンパイル、結合、圧縮して出力 [./public/css]  

# ビルド - 開発モード(TypeScript)
```
build.sh dev
```
- gulp + eslint  
	- [./src] のソースファイルを構文チェック  
- gulp + tsc  
	- TypeScript を tsconfig.json の設定でコンパイルして出力[./dist/public]  
- gulp + uglify  
	- tsc でコンパイルした JavaScript[./dist/public/js/app.js] を圧縮して出力[./public/js/appp.min.js]  
- gulp + tsc  
	- TypeScript のファイルを監視しコンパイル  

# ソースコードのチェック
- 構文チェック＋自動整形  
	```
	npm run check
	```

- 構文チェック  
	```
	npm run formatter
	```

- 自動整形  
	```
	npm run linter
	```

- git commit  
	- husky + lint-staged  
		```
		# 構文チェック
		eslint --fix --max-warnings=0
		+
		# 自動整形
		prettier --write
		```

# 起動
- docker コンテナで Next.js, Node.js, MongoDB, Mongo Express, Redis を起動します  
	- Next.js  
		```
		./start.sh next
		```

	- Node.js[PM2]：本番モード  
		```
		./start.sh
		```

	- Node.js[ts-node]：開発モード  
		```
		./start.sh tsn
		```

	- Node.js[ts-node-dev]：開発モード  
		```
		./start.sh tsndev
		```


- Node.js の起動
	docker コンテナを使わない＝ docker コンテナが停止している状態で動作します  
	Node.js の実行するホスト名が docker コンテナのホスト名 [maps] でない場合、  
	docker コンテナにより動作する MongoDB に関係する処理のみ機能させずに起動します  
	- ts-node  
		```
		npm run tsn_start
		```
		= `npm run ts-node --project ./tsconfig.node.json src/node/index.ts`

	- ts-node-dev  
		```
		npm run tsn_start_dev
		```
		= `npm run-dev ts-node --project ./tsconfig.node.json src/node/index.ts`

	- node（トランスパイル済み js）  
		```
		node dist/node/node/index.js
		```

- Next.js の起動  
	```
	npm run next
	```

- Node.js の起動と制御[PM2]
	- 起動  
		```
		npm run prod_start
		```

	- 起動状況のモニター  
		```
		npm run prod_moni
		```

	- 停止  
		```
		npm run prod_stop
		```

	- 削除  
		```
		npm run prod_delete
		```

- [docker コンテナ操作スクリプトの説明](./docker/README.md)

# サイト表示
- メインページ(Node.js)  
	http://localhost:8080/  

- メインページ - 開発モード(Node.js)  
	http://localhost:8080/index.html?dev=1  

- メインページ(Next.js)  
	http://localhost:3000/  

- API(Node.js)  
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
