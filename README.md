# maps
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
- `src/ts/*.ts` のコンパイルして、`public/js/*.js` へ出力
- `public/js/*.js`、`public/lib/*.js` のファイルを minify して、`public/js/*.min.js` へ出力
- `src/scss/*.scss` のコンパイルして、`public/css/*.css` へ出力
- `public/css/*.css`、`public/lib/*.css` のファイルを minify して、`public/css/*.min.css` へ出力

## ビルド（開発モード）
```
build.sh dev
```
- `src/scss/*.scss` のコンパイルして、`public/css/*.css` へ出力
- `src/ts/*.ts` のコンパイル、変更を監視して、`public/js/*.js` へ出力

## 起動
```
node index.js
```

## 表示
http://localhost:8080/

## 表示（開発モード）
http://localhost:8080/index.html?dev=1
minify 前のファイルを使う
