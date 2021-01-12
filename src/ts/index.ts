var oApp = new app();

oApp.css("lib/leaflet.css");
oApp.css("lib/leaflet.awesome-markers.css");
oApp.css("https://use.fontawesome.com/releases/v5.0.13/css/all.css");

oApp.js("lib/leaflet.js");
oApp.js("lib/leaflet.awesome-markers.js");
oApp.js("lib/chart.js");

oApp.js("js/maps.js");
oApp.js("js/mapsGpxChart.js");

oApp.js("js/appMap.js");
oApp.js("js/mapsDataPrefCapital.js");

/**
 * 地理院タイル
 */
class appMapsGSI {
	private oMaps: maps | null = null;
	private oDiv: HTMLElement | null = null;
	private oImg: HTMLImageElement[] = [];
	private oImgPos: mapsTile[] = [];
	private n: number = 0;

	/**
	 * constructor
	 * @param oMaps
	 */
	constructor(oMaps: maps) {
		this.oMaps = oMaps;
	}

	/**
	 * 設定：DIV
	 * @param o Divオブジェクト
	 */
	public setDiv(o: HTMLElement): void {
		this.oDiv = o;
		this.oImg = [];
		this.oImgPos = [];
		this.n = 0;
	}

	/**
	 * 設定：タイル
	 * @param o タイル画像オブジェクト
	 * @param pos タイル座標情報
	 */
	public setTile(o: HTMLImageElement, pos: mapsTile): void {
		this.oImg.push(o);
		this.oImgPos.push(pos);
	}

	/**
	 * シンボル生成
	 * @param w シンボル幅[px]
	 * @param h シンボル高[px]
	 */
	public Symbol(w: number, h: number): void {
		this.n++;
		if (this.oImg.length === this.n) {
			this.oImg.map((o: HTMLImageElement, n: number, oImg: HTMLImageElement[]) => {
				const vImgR: ClientRect = o.getBoundingClientRect();

				const vImgY: number = vImgR.top + window.pageYOffset;
				const vImgX: number = vImgR.left + window.pageXOffset;
				const oImgP: HTMLElement = document.createElement("div");
				oImgP.innerHTML = "▲";
				oImgP.style.fontSize = "24px";
				oImgP.style.color = "#FF0000";
				oImgP.style.position = "absolute";
				oImgP.style.top = (vImgY + this.oImgPos[n].px_y - (w * 0.5)) + "px";
				oImgP.style.left = (vImgX + this.oImgPos[n].px_x - (h * 0.5)) + "px";

				if(this.oDiv) {
					this.oDiv.append(oImgP);
				}
			});
		}
	}
}

window.onload = () => {
	page();
}

window.onhashchange = () => {
	page();
}

/**
 * 初期処理
 * @param id DivID
 * @returns 処理ステータス
 */
function init(id: string) : boolean {
	const oDiv: HTMLElement | null = document.getElementById(id);
	if (oDiv) {
		if (oDiv.getAttribute("data-init") === "true"){
			return false;
		}
		else{
			oDiv.setAttribute("data-init", "true");
			return true;
		}
	}
	return false;
}

/**
 * ページ
 */
function page() : void {
	const oMaps: maps = new maps();
	let oAppMap: appMap | null = null;
	const oappMapsGSI = new appMapsGSI(oMaps);

	let vDiv: string[] | null = ["Accuracy", "Distance", "DistanceTo", "Scale", "Tile", "TileE", "DataGpx"];
	const fDiv: { [key: string]: boolean } = {};
	vDiv.map((key: string, n: number, vDiv: string[]) => {
		fDiv[key] = false;
		const oDiv: HTMLElement | null = document.getElementById(key);
		if (oDiv) {
			oDiv.style.display = "none";
		}
	});

	let vHash: string = window.location.hash;
	let vHashDiv: string = "";
	if (vHash.length > 0) {
		vHash = vHashDiv = vHash.substring(1);
		if (vHash === "TileE") {
			vHashDiv = "Tile";
		}
		const oDiv: HTMLElement | null = document.getElementById(vHashDiv);
		if (oDiv !== null) {
			oDiv.style.display = "block";
			fDiv[vHash] = true;
			vDiv = null;
		}
	}

	if (vDiv !== null) {
		vDiv.map((key: string, n: number, vDiv: string[]) => {
			const oDiv: HTMLElement | null = document.getElementById(key);
			if (oDiv !== null) {
				oDiv.style.display = "none";
				fDiv[key] = false;
			}
		});
	}

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
	// 精度
	if (fDiv["Accuracy"] === true) {
		if (!init("Accuracy")) {
			return;
		}

		const oMapsDataPrefCapital: mapsDataPrefCapital = new mapsDataPrefCapital();
		const dmapsDataPrefCapital: mapsDataPrefCapitalItem[] = oMapsDataPrefCapital.get();

		oAppMap = new appMap("appAccuracyMap", _MapLat, _MapLon, _MapZ, _MapOptions);
		const distanceTo = [10, 100, 1000, 10000, 100000];
		dmapsDataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number, dmapsDataPrefCapital: mapsDataPrefCapitalItem[]) => {
			if (!oAppMap) {
				return;
			}

			const pref: string = item.pref;
			const lat: number = item.lat;
			const lon: number = item.lon;
			let options: { [key: string]: any } = {};

			distanceTo.map((distance: number, n: number, distanceTo: number[]) => {
				if (!oAppMap) {
					return;
				}

				for (let i = 0; i < 2; i++) {
					let a: number = 0;
					const atob: number[][] = [];
					const atob_item: number[] = new Array(2);
					atob_item[0] = lat;
					atob_item[1] = lon;
					atob.push(atob_item);
					if (i === 0) {
						a = 0;
					}
					else if (i === 1) {
						a = 180;
					}
					const c: mapsLatLon = oMaps.distanceTo(lat, lon, a, distance);

					options.color = "blue";
					options.popup = "<ol style=\"list-style-type: none;\"><li>" + pref + "から" + distance.toLocaleString() + "m" + "</li><li>緯度：" + lat + "</li><li>経度：" + lon + "</li></ol>";
					oAppMap.point(c.lat, lon, options);

					atob.push(new Array(c.lat, lon));

					options = {};
					options.color = "#4169e1";
					oAppMap.arc(atob, options);
				}
			});

			options.color = "red";
			options.popup = "<ol style=\"list-style-type: none;\"><li>" + pref + "</li><li>緯度：" + lat + "</li><li>経度：" + lon + "</li></ol>";
			oAppMap.point(lat, lon, options);
		});
	}

	/*==============================================================================================*/
	// ２地点間の距離＆ある地点から角度と距離を指定して地点を求める
	if (fDiv["Distance"] === true || fDiv["DistanceTo"] === true) {
		const oMapsDataPrefCapital: mapsDataPrefCapital = new mapsDataPrefCapital();
		const dmapsDataPrefCapital: mapsDataPrefCapitalItem[] = oMapsDataPrefCapital.get();

		const base:number = 12;
		const item_base = dmapsDataPrefCapital[base];
		for (let t = 0; t < 2; t++) {
			let oDiv: HTMLElement | null = null;

			if (t === 0) {
				if (!init("Distance")) {
					return;
				}

				// ２地点間の距離を求める
				oDiv = document.getElementById("appDistance");
				oAppMap = new appMap("appDistanceMap", _MapLat, _MapLon, _MapZ, _MapOptions);
			}
			else if (t === 1) {
				if (!init("appDistanceTo")) {
					return;
				}

				// ある地点から角度と距離を指定して地点を求める
				oDiv = document.getElementById("appDistanceTo");
				oAppMap = new appMap("appDistanceToMap", _MapLat, _MapLon, _MapZ, _MapOptions);
			}

			if (!oDiv || !oAppMap) {
				return;
			}

			const oDivTitle: HTMLElement = document.createElement("div");
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
			if (t === 1) {
				dd_c_lat.innerHTML = "経度を算出=<br />方角＋距離<br/>（ヒュベニ）";
				dd_c_lon.innerHTML = "経度を算出=<br />方角＋距離<br/>（ヒュベニ）";
			}

			dl.appendChild(dt);
			dl.appendChild(dd_lat);
			dl.appendChild(dd_lon);
			dl.appendChild(dd_distT);
			dl.appendChild(dd_distH);
			dl.appendChild(dd_distS);
			dl.appendChild(dd_a);
			if (t === 1) {
				dl.appendChild(dd_c_lat);
				dl.appendChild(dd_c_lon);
			}

			oDiv.appendChild(dl);

			let options: { [key: string]: any } = {};
			options.color = "red";
			options.popup = item_base.pref;
			oAppMap.point(item_base.lat, item_base.lon, options);

			dmapsDataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number, dmapsDataPrefCapital: mapsDataPrefCapitalItem[]) => {
				if (!oDiv || !oAppMap) {
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

					if (t === 0) {
						item.distT = oMaps.distanceT(item_base.lat, item_base.lon, item.lat, item.lon);
						item.distH = oMaps.distanceH(item_base.lat, item_base.lon, item.lat, item.lon);
						item.distS = oMaps.distanceS(item_base.lat, item_base.lon, item.lat, item.lon);
						item.a = oMaps.direction(item_base.lat, item_base.lon, item.lat, item.lon);
					}
					else if (t === 1) {
						const c: mapsLatLon = oMaps.distanceTo(item_base.lat, item_base.lon, item.a, item.distH);
						item.c_lat = c.lat;
						item.c_lon = c.lon;

						dd_c_lat.innerHTML = "" + item.c_lat;
						dd_c_lon.innerHTML = "" + item.c_lon;
					}

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
					if (t === 1) {
						dl.appendChild(dd_c_lat);
						dl.appendChild(dd_c_lon);
					}

					oDiv.appendChild(dl);


					options = {};
					options.color = "blue";
					options.popup = "<ol style=\"list-style-type: none;\"><li>" + item.pref + "</li><li>緯度：" + item.lat + "</li><li>経度：" + item.lon + "</li></ol>";
					oAppMap.point(item.lat, item.lon, options);


					if (t === 1) {
						options = {};
						options.color = "green";
						options.popup = "<ol style=\"list-style-type: none;\"><li>" + item.pref + "</li><li>" + item_base.pref + "から距離[" + item.distH + "m],方角[" + item.a + "]で求めた地点" + "</li></ol>";
						oAppMap.point(item.c_lat, item.c_lon, options);
					}

					const atob: number[][] = [];
					atob.push(new Array(item_base.lat, item_base.lon));
					atob.push(new Array(item.lat, item.lon));

					options = {};
					options.color = "#4169e1";
					options.popup = "<ol style=\"list-style-type: none;\"><li>" + item_base.pref + "→" + item.pref + "</li><li>距離：" + item.distH.toLocaleString() + "</li><li>方角：" + item.a + "</li></ol>";
					oAppMap.arc(atob, options);
				}
			});
		}
	}

	/*==============================================================================================*/
	// ズームレベルと縮尺
	if (fDiv["Scale"] === true) {
		if (!init("Scale")) {
			return;
		}

		const vDPI: number = 96;

		const vTitle: string = "ズームレベルと縮尺";
		_MapLat = 35.65809922;
		_MapLon = 139.741357472;

		const oDiv: HTMLElement | null = document.getElementById("Scale");
		if (oDiv) {
			oDiv.style.width = "800px";
		}

		const oDivTitle: HTMLElement | null = document.getElementById("appScaleTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = vTitle;
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
	// 緯度経度からタイル情報を取得し、タイル左上原点の緯度経度と標高タイルから標高値を求める
	if (fDiv["Tile"] === true || fDiv["TileE"] === true) {
		_MapZ = 4;
		_MapLat = 35.360771305;
		_MapLon = 138.7273035;

		let vTitle: string = "緯度経度からタイル情報を取得し、タイル左上原点の緯度経度を求める";
		if (vHash === "" || vHash === "TileE") {
			vTitle = "緯度経度からタイル情報を取得し、タイル左上原点の緯度経度と標高タイルから標高値を求める";
		}

		let vUrl: string = "";

		let oDiv: HTMLElement | null = document.getElementById("Tile");
		if (oDiv) {
			oDiv.style.width = "900px";
		}

		const oDivTitle: HTMLElement | null = document.getElementById("appTileTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = vTitle;
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
			vTileLatLon = oMaps.tile2LatLng(vTile.x, vTile.y, vTile.z);

			oTableTr = document.createElement("tr");

			oTableTd = document.createElement("th");
			oTableTd.style.textAlign = "left";
			oTableTd.innerHTML = "タイル左上の緯度、経度";
			oTableTr.append(oTableTd);

			oTableTd = document.createElement("td");
			oTableTd.innerHTML = "" + vTileLatLon.lat + ", " + vTileLatLon.lon;
			oTableTr.append(oTableTd);

			oTable.append(oTableTr);

			//
			if (vHash === "" || vHash === "TileE") {
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
			}

			const oImg: HTMLImageElement = document.createElement("img");
			oappMapsGSI.setTile(oImg, vTile);

			oImg.src = vUrl;
			oImg.onload = (e) => {
				oappMapsGSI.Symbol(24, 24);
			}

			oDiv.append(oTable);
			oDiv.append(oImg);

			if (vHash === "" || vHash === "TileE") {
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
	}
	/*==============================================================================================*/
	// GPX
	if (fDiv["DataGpx"] === true) {
		if (!init("DataGpx")) {
			return;
		}

		const vTitle = "Garamin の GPS ログデータ（GPX）を読み込んでグラフ表示";

		const oDivTitle: HTMLElement | null = document.getElementById("appDataGpxTitle");
		if (oDivTitle) {
			oDivTitle.innerHTML = vTitle;
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