import { maps, mapsLatLon, mapsTile, mapsTileDem } from "../ts/maps";
import { appMaps } from "../ts/appMaps";
import { appMapsGSI } from "../ts/appMapsGSI";
import { indexView } from "./indexView";
import { ViewMenuTitle } from "./ViewMenu";

/**
 * ページ
 * @param oView indexView
 */
function page(oView: indexView): void {
	const oMaps: maps = new maps();
	let oAppMaps: appMaps | null = null;
	const oappMapsGSI = new appMapsGSI(oMaps);

	const vHash = getHash();
	oView.display(vHash);

	/*==============================================================================================*/
	// 地図
	let _MapLat = 35.681236;
	let _MapLon = 139.767125;
	let _MapZ = 5;
	const _MapOptions = {
		w: 100,
		wUnit: "%",
		h: 600,
		hUnit: "px",
	};

	/*==============================================================================================*/
	if (!oView.status("Tile", vHash)) {
		_MapZ = 4;
		_MapLat = 35.360771305;
		_MapLon = 138.7273035;

		let vUrl = "";

		let oDiv: HTMLElement | null = document.getElementById("Tile");
		if (oDiv) {
			oDiv.style.width = "900px";
		}

		const oDivTitleSub: HTMLElement | null = document.getElementById("appTileTitleSub");
		if (oDivTitleSub) {
			oDivTitleSub.innerHTML = `富士山山頂の緯度[ ${_MapLat} ]、緯度 [ ${_MapLon} ] からタイルとタイル情報を計算`;
		}

		oDiv = document.getElementById("appTile");
		if (!oDiv) {
			return;
		}

		oappMapsGSI.setDiv(oDiv);

		for (let i = _MapZ; i < 19; i++) {
			const vTile: mapsTile = oMaps.tile(_MapLat, _MapLon, i);
			let vTileLatLon: mapsLatLon | null = null;
			vUrl = `https://cyberjapandata.gsi.go.jp/xyz/std/${vTile.z}/${vTile.x}/${vTile.y}.png`;

			const oTable: HTMLElement = document.createElement("table");
			oTable.style.width = "890px";

			//
			let oTableTr: HTMLElement = document.createElement("tr");

			let oTableTd: HTMLElement = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "ズームレベル";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = `${vTile.z}`;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "タイル座標座標(X, Y)";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = `${vTile.x}, ${vTile.y}`;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "タイル左上からpixel 値(X, Y)";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = `${vTile.px_x}, ${vTile.px_y}`;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			vTileLatLon = oMaps.tile2LatLon(vTile.x, vTile.y, vTile.z);

			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "タイル左上の緯度、経度";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = `${vTileLatLon.lat}, ${vTileLatLon.lon}`;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "標高（TXT形式）<br>標高タイル";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = `<div id="appTileDem${vTile.z}Txt"></div>`;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "標高（PNG形式）<br>標高タイル";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = `<div id="appTileDem${vTile.z}Png"></div>`;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			const oImg: HTMLImageElement = document.createElement("img");
			oappMapsGSI.setTile(oImg, vTile);

			oImg.src = vUrl;
			oImg.onload = () => {
				oappMapsGSI.Symbol(24, 24);
			};

			oDiv.append(oTable);
			oDiv.append(oImg);

			if (oMaps) {
				const oMapTileDem: Promise<mapsTileDem> | null = oMaps.tileDemTxt(vTile);
				if (oMapTileDem) {
					void oMapTileDem.then((data: mapsTileDem) => {
						if (!data.tile) {
							return;
						}
						const o: HTMLElement | null = document.getElementById(`appTileDem${data.tile.z}Txt`);
						if (!o) {
							return;
						}
						if (isNaN(data.e)) {
							o.innerHTML = "標高データなし";
						} else {
							o.innerHTML = data.e.toLocaleString() + " m" + "<br>" + data.url;
						}
					});
				}

				const oMapTileDemPng: Promise<mapsTileDem> | null = oMaps.tileDemPng(vTile);
				if (oMapTileDemPng) {
					void oMapTileDemPng.then((data: mapsTileDem) => {
						if (!data.tile) {
							return;
						}
						const o: HTMLElement | null = document.getElementById(`appTileDem${data.tile.z}Png`);
						if (!o) {
							return;
						}
						if (isNaN(data.e)) {
							o.innerHTML = "標高データなし";
						} else {
							o.innerHTML = data.e.toLocaleString() + " m" + "<br>" + data.url;
						}
					});
				}
			}
		}
	}
	/*==============================================================================================*/
	if (!oView.status("MongoDB", vHash)) {
		oAppMaps = new appMaps("appMongoDBMap", _MapLat, _MapLon, _MapZ, _MapOptions);
		oAppMaps.layerPref();
	}
}

const title: ViewMenuTitle[] = [
	{ key: "Distance", title: "２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める" },
	{ key: "Scale", title: "ズームレベルから縮尺を求める" },
	{
		key: "Tile",
		title: "緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める",
	},
	{
		key: "DataGpx",
		title: "GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示",
	},
	{ key: "MongoDB", title: "MongoDB（地理空間データ）によるデータ検索" },
];

const getHash = () => {
	let vHash: string = window.location.hash;
	if (vHash.length > 0) {
		vHash = vHash.substring(1);
	}

	let f = false;
	title.map((item: ViewMenuTitle) => {
		if (item.key.toLowerCase() === vHash.toLowerCase()) {
			f = true;
		}
	});

	if (!f) {
		vHash = title[0].key;
	}

	return vHash;
};

/**
 * window.onload
 */
window.onload = () => {
	const oView: indexView = new indexView();
	title.map((item: ViewMenuTitle) => {
		oView.setMenuTitle(item);
	});

	const oContents = document.getElementById("app");
	if (oContents) {
		oView.renderApp(oContents, getHash());
	}

	page(oView);

	/**
	 * window.onhashchange
	 */
	window.onhashchange = () => {
		page(oView);
	};
};
