import { maps, mapsLatLon, mapsTile, mapsTileDem, mapsDataGpx } from "../ts/maps";
import { mapsDataGpxChart } from "../ts/mapsGpxChart";
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from "../ts/mapsDataPrefCapital";
import { appMaps } from "../ts/appMaps";
import { appMapsGSI } from "../ts/appMapsGSI";
import { indexView } from "./indexView";
import { indexMenuTitle } from "./indexViewMenu";

/**
 * ページ
 * @param oView indexView
 */
function page(oView: indexView) : void {
	const oMaps: maps = new maps();
	let oAppMaps: appMaps | null = null;
	const oappMapsGSI = new appMapsGSI(oMaps);

	const vHash: string = window.location.hash;
	let vHashDiv: string = "";
	if (vHash.length > 0) {
		vHashDiv = vHash.substring(1);
	}
	oView.display(vHashDiv);

	/*==============================================================================================*/
	// 地図
	let _MapLat: number = 35.681236;
	let _MapLon: number = 139.767125;
	let _MapZ: number = 5;
	let _MapOptions: { [key: string]: any } = {};
	_MapOptions.w = 100;
	_MapOptions.wUnit = "%";
	_MapOptions.h = 600;
	_MapOptions.hUnit = "px";

	/*==============================================================================================*/
	if (!oView.status("Distance", vHashDiv)) {
		let oDivTitle: HTMLElement | null = document.getElementById("appDistanceTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = oView.getMenuTitle("Distance");
		}

		const oMapsDataPrefCapital: mapsDataPrefCapital = new mapsDataPrefCapital();
		const dmapsDataPrefCapital: mapsDataPrefCapitalItem[] = oMapsDataPrefCapital.get();

		const base:number = 12;
		const item_base = dmapsDataPrefCapital[base];
		const oDiv: HTMLElement | null = document.getElementById("appDistance");
		oAppMaps = new appMaps("appDistanceMap", _MapLat, _MapLon, _MapZ, _MapOptions);

		if (!oDiv || !oAppMaps) {
			return;
		}

		oDivTitle = document.createElement("div");
		oDivTitle.innerHTML = item_base.pref + "からの距離";
		oDiv.appendChild(oDivTitle);

		let dl: HTMLElement = document.createElement("dl");
		let dt: HTMLElement = document.createElement("dt");
		let dd_lat: HTMLElement = document.createElement("dd");
		let dd_lon: HTMLElement = document.createElement("dd");
		let dd_distT: HTMLElement = document.createElement("dd");
		let dd_distH: HTMLElement = document.createElement("dd");
		let dd_distS: HTMLElement = document.createElement("dd");
		let dd_a: HTMLElement = document.createElement("dd");
		let dd_c_lat: HTMLElement = document.createElement("dd");
		let dd_c_lon: HTMLElement = document.createElement("dd");

		dt.innerHTML = "県庁";
		dd_lat.innerHTML = "緯度";
		dd_lon.innerHTML = "経度";
		dd_distT.innerHTML = "距離<br/>（三角球面法）";
		dd_distH.innerHTML = "距離<br/>（ヒュベニ）";
		dd_distS.innerHTML = "距離<br/>（測地線航海算法）";
		dd_a.innerHTML = "方角";
		dd_c_lat.innerHTML = "経度を算出=<br />方角＋距離<br/>（ヒュベニ）";
		dd_c_lon.innerHTML = "経度を算出=<br />方角＋距離<br/>（ヒュベニ）";

		dl.appendChild(dt);
		dl.appendChild(dd_lat);
		dl.appendChild(dd_lon);
		dl.appendChild(dd_distT);
		dl.appendChild(dd_distH);
		dl.appendChild(dd_distS);
		dl.appendChild(dd_a);
		dl.appendChild(dd_c_lat);
		dl.appendChild(dd_c_lon);

		oDiv.appendChild(dl);

		let options: { [key: string]: any } = {};
		options.color = "red";
		options.popup = item_base.pref;
		oAppMaps.point(item_base.lat, item_base.lon, options);

		dmapsDataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number, dmapsDataPrefCapital: mapsDataPrefCapitalItem[]) => {
			if (!oDiv || !oAppMaps) {
				return;
			}

			if (n !== base) {
				dl = document.createElement("dl");
				dt = document.createElement("dt");
				dd_lat = document.createElement("dd");
				dd_lon = document.createElement("dd");
				dd_distT = document.createElement("dd");
				dd_distH = document.createElement("dd");
				dd_distS = document.createElement("dd");
				dd_a = document.createElement("dd");
				dd_c_lat = document.createElement("dd");
				dd_c_lon = document.createElement("dd");

				item.distT = oMaps.distanceT(item_base.lat, item_base.lon, item.lat, item.lon);
				item.distH = oMaps.distanceH(item_base.lat, item_base.lon, item.lat, item.lon);
				item.distS = oMaps.distanceS(item_base.lat, item_base.lon, item.lat, item.lon);
				item.a = oMaps.direction(item_base.lat, item_base.lon, item.lat, item.lon);

				const c: mapsLatLon = oMaps.distanceTo(item_base.lat, item_base.lon, item.a, item.distH);
				item.c_lat = c.lat;
				item.c_lon = c.lon;

				dd_c_lat.innerHTML = "" + item.c_lat;
				dd_c_lon.innerHTML = "" + item.c_lon;

				dt.innerHTML = item.pref;
				dd_lat.innerHTML = "" + item.lat;
				dd_lon.innerHTML = "" + item.lon;
				dd_distT.innerHTML = "" + item.distT / 1000;
				dd_distH.innerHTML = "" + item.distH / 1000;
				dd_distS.innerHTML = "" + item.distS / 1000;
				dd_a.innerHTML = "" + item.a;

				dl.appendChild(dt);
				dl.appendChild(dd_lat);
				dl.appendChild(dd_lon);
				dl.appendChild(dd_distT);
				dl.appendChild(dd_distH);
				dl.appendChild(dd_distS);
				dl.appendChild(dd_a);
				dl.appendChild(dd_c_lat);
				dl.appendChild(dd_c_lon);

				oDiv.appendChild(dl);


				options = {};
				options.color = "blue";
				options.popup = "<ol style=\"list-style-type: none;\"><li>" + item.pref + "</li><li>緯度：" + item.lat + "</li><li>経度：" + item.lon + "</li></ol>";
				oAppMaps.point(item.lat, item.lon, options);

				options = {};
				options.color = "green";
				options.popup = "<ol style=\"list-style-type: none;\"><li>" + item.pref + "</li><li>" + item_base.pref + "から距離[" + item.distH + "m],方角[" + item.a + "]で求めた地点" + "</li></ol>";
				oAppMaps.point(item.c_lat, item.c_lon, options);

				const atob: number[][] = [];
				atob.push(new Array(item_base.lat, item_base.lon));
				atob.push(new Array(item.lat, item.lon));

				options = {};
				options.color = "#4169e1";
				options.popup = "<ol style=\"list-style-type: none;\"><li>" + item_base.pref + "→" + item.pref + "</li><li>距離：" + item.distH.toLocaleString() + "</li><li>方角：" + item.a + "</li></ol>";
				oAppMaps.arc(atob, options);
			}
		});
	}
	/*==============================================================================================*/
	if (!oView.status("Scale", vHashDiv)) {
		const vDPI: number = 96;

		_MapLat = 35.65809922;
		_MapLon = 139.741357472;

		const oDiv: HTMLElement | null = document.getElementById("Scale");
		if (oDiv) {
			oDiv.style.width = "800px";
		}

		const oDivTitle: HTMLElement | null = document.getElementById("appScaleTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = oView.getMenuTitle("Scale");
		}

		const oDivTitleSub: HTMLElement | null = document.getElementById("appScaleTitleSub");
		if (oDivTitleSub) {
			oDivTitleSub.innerHTML = "日本経緯度原点（東京都港区麻布台2 - 18 - 1）<br>緯度[ " + _MapLat + " ]、解像度 [ " + vDPI + " ] dpi で計算";
		}

		const oTable: HTMLElement = document.createElement("table");

		let oTableTr: HTMLElement = document.createElement("tr");
		let oTableTd: HTMLElement = document.createElement("th");
		oTableTd.innerHTML = "ズームレベル";
		oTableTr.append(oTableTd);

		oTableTd = document.createElement("th");
		oTableTd.innerHTML = "縮尺";
		oTableTr.append(oTableTd);

		oTable.append(oTableTr);

		for (let i = 0; i < 29; i++) {
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "" + i;
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "1 / " + Math.floor(oMaps.tileScale(i, _MapLat, vDPI)).toLocaleString();
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);
		}
		if (oDiv) {
			oDiv.append(oTable);
		}
	}
	/*==============================================================================================*/
	if (!oView.status("Tile", vHashDiv)) {
		_MapZ = 4;
		_MapLat = 35.360771305;
		_MapLon = 138.7273035;

		let vUrl: string = "";

		let oDiv: HTMLElement | null = document.getElementById("Tile");
		if (oDiv) {
			oDiv.style.width = "900px";
		}

		const oDivTitle: HTMLElement | null = document.getElementById("appTileTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = oView.getMenuTitle("Tile");
		}

		const oDivTitleSub: HTMLElement | null = document.getElementById("appTileTitleSub");
		if (oDivTitleSub) {
			oDivTitleSub.innerHTML = "富士山山頂の緯度[ " + _MapLat + " ]、緯度 [ " + _MapLon + " ] からタイルとタイル情報を計算";
		}

		oDiv = document.getElementById("appTile");
		if (!oDiv) {
			return;
		}

		oappMapsGSI.setDiv(oDiv);

		for (let i = _MapZ; i < 19; i++) {
			const vTile: mapsTile = oMaps.tile(_MapLat, _MapLon, i);
			let vTileLatLon: mapsLatLon | null = null;
			vUrl = "https://cyberjapandata.gsi.go.jp/xyz/std/" + vTile.z + "/" + vTile.x + "/" + vTile.y + ".png"

			const oTable: HTMLElement = document.createElement("table");
			oTable.style.width = "890px";

			//
			let oTableTr: HTMLElement = document.createElement("tr");

			let oTableTd: HTMLElement = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "ズームレベル";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "" + vTile.z;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "タイル座標座標(X, Y)";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "" + vTile.x + ", " + vTile.y;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "タイル左上からpixel 値(X, Y)";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "" + vTile.px_x + ", " + vTile.px_y;
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
			oTableTd.innerHTML = "" + vTileLatLon.lat + ", " + vTileLatLon.lon;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "標高（TXT形式）<br>標高タイル";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "<div id=\"appTileDem" + vTile.z + "Txt\"></div>";
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "標高（PNG形式）<br>標高タイル";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "<div id=\"appTileDem" + vTile.z + "Png\"></div>";
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			const oImg: HTMLImageElement = document.createElement("img");
			oappMapsGSI.setTile(oImg, vTile);

			oImg.src = vUrl;
			oImg.onload = (e) => {
				oappMapsGSI.Symbol(24, 24);
			}

			oDiv.append(oTable);
			oDiv.append(oImg);

			if (oMaps) {
				const oMapTileDem : Promise<mapsTileDem> | null = oMaps.tileDemTxt(vTile);
				if(oMapTileDem){
					oMapTileDem.then((data: mapsTileDem) => {
						if (!data.tile) {
							return;
						}
						const o: HTMLElement | null = document.getElementById("appTileDem" + data.tile.z + "Txt");
						if (!o) {
							return;
						}
						if (data.e === NaN) {
							o.innerHTML = "標高データなし";
						}
						else {
							o.innerHTML = data.e.toLocaleString() + " m" + "<br>" + data.url;
						}
					}
					);
				}

				const oMapTileDemPng : Promise<mapsTileDem> | null = oMaps.tileDemPng(vTile);
				if (oMapTileDemPng) {
					oMapTileDemPng.then((data: mapsTileDem) => {
						if (!data.tile) {
							return;
						}
						const o: HTMLElement | null = document.getElementById("appTileDem" + data.tile.z + "Png");
						if (!o) {
							return;
						}
						if (data.e === NaN) {
							o.innerHTML = "標高データなし";
						}
						else {
							o.innerHTML = data.e.toLocaleString() + " m" + "<br>" + data.url;
						}
					}
					);
				}
			}
		}
	}
	/*==============================================================================================*/
	if (!oView.status("DataGpx", vHashDiv)) {
		const oDivTitle: HTMLElement | null = document.getElementById("appDataGpxTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = oView.getMenuTitle("DataGpx");
		}

		const oDiv: HTMLElement | null = document.getElementById("appDataGpx");
		if (oDiv) {
			//
			const oDiv20190519 = document.createElement("div");
			const oDiv20190519_Title = document.createElement("div");

			oDiv.appendChild(oDiv20190519_Title);
			oDiv.appendChild(oDiv20190519);

			oMaps.gpx("./data/20190519.gpx").then((data: mapsDataGpx) => {
				oDiv20190519_Title.innerHTML = data.getName();

				const o: mapsDataGpxChart = new mapsDataGpxChart(oDiv20190519, data);
				o.refresh(1100, 500, 150);
			}
			);

			//
			const oDiv20190428 = document.createElement("div");
			const oDiv20190428_Title = document.createElement("div");

			oDiv.appendChild(oDiv20190428_Title);
			oDiv.appendChild(oDiv20190428);

			oMaps.gpx("./data/20190428.gpx").then((data: mapsDataGpx) => {
				oDiv20190428_Title.innerHTML = data.getName();

				const o: mapsDataGpxChart = new mapsDataGpxChart(oDiv20190428, data);
				o.refresh(1100, 500, 150);
			}
			);


			//
			const oDiv20180811 = document.createElement("div");
			const oDiv20180811_Title = document.createElement("div");

			oDiv.appendChild(oDiv20180811_Title);
			oDiv.appendChild(oDiv20180811);

			oMaps.gpx("./data/20180811.gpx").then((data: mapsDataGpx) => {
				oDiv20180811_Title.innerHTML = data.getName();

				const o: mapsDataGpxChart = new mapsDataGpxChart(oDiv20180811, data);
				o.refresh(1100, 500, 150);
			}
			);
		}
	}
}

/**
 * window.onload
 */
window.onload = () => {
	const oView: indexView = new indexView();

	const title: indexMenuTitle[] = [
		{ key: "Distance", title: "２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める" }
		, { key: "Scale", title: "ズームレベルから縮尺を求める" }
		, { key: "Tile", title: "緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める" }
		, { key: "DataGpx", title: "GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示" }
	];
	title.map((item: indexMenuTitle) => {
		oView.setMenuTitle(item);
	});

	oView.renderMenu(document.getElementById("menu"));
	oView.renderContents(document.getElementById("contents"));

	page(oView);

	/**
	 * window.onhashchange
	 */
	window.onhashchange = () => {
		page(oView);
	}
}