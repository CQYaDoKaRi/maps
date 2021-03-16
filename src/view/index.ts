import { appMaps } from "../ts/appMaps";
import { indexView } from "./indexView";
import { ViewMenuTitle } from "./ViewMenu";

/**
 * ページ
 * @param oView indexView
 */
function page(oView: indexView): void {
	let oAppMaps: appMaps | null = null;

	const vHash = getHash();
	oView.display(vHash);

	/*==============================================================================================*/
	// 地図
	const _MapLat = 35.681236;
	const _MapLon = 139.767125;
	const _MapZ = 5;
	const _MapOptions = {
		w: 100,
		wUnit: "%",
		h: 600,
		hUnit: "px",
	};

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
