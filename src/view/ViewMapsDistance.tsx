// npm install --save-dev react @types/react
import React from "react";
import { maps, mapsLatLon } from "../ts/maps";
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from "../ts/mapsDataPrefCapital";
import { appMaps } from "../ts/appMaps";

/**
 * React Component - ViewMapsDistance - props
 */
type Props = {
	mapLat: number;
	mapLon: number;
	mapZ: number;
};

/**
 * React Component - ViewMapsDistance
 * @param props props
 */
const ViewMapsDistance: React.FC<Props> = (props) => {
	const oMapsDataPrefCapital: mapsDataPrefCapital = new mapsDataPrefCapital();
	const dmapsDataPrefCapital: mapsDataPrefCapitalItem[] = oMapsDataPrefCapital.get();

	const _MapLat = props.mapLat;
	const _MapLon = props.mapLon;
	const _MapZ = props.mapZ;
	const _MapOptions = {
		w: 100,
		wUnit: "%",
		h: 600,
		hUnit: "px",
	};

	const oMaps: maps = new maps();
	let oAppMaps: appMaps | null = null;

	const base = 12;
	const item_base = dmapsDataPrefCapital[base];
	const oDiv: HTMLElement | null = document.getElementById("appDistance");
	oAppMaps = new appMaps("appDistanceMap", _MapLat, _MapLon, _MapZ, _MapOptions);
	oAppMaps.layerBase();
	if (oDiv && oAppMaps) {
		const oDivTitle = document.createElement("div");
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

		let options = {
			color: "red",
			popup: item_base.pref,
		};
		oAppMaps.point(item_base.lat, item_base.lon, options);

		dmapsDataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number) => {
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

				dd_c_lat.innerHTML = `${item.c_lat}`;
				dd_c_lon.innerHTML = `${item.c_lon}`;

				dt.innerHTML = item.pref;
				dd_lat.innerHTML = `${item.lat}`;
				dd_lon.innerHTML = `${item.lon}`;
				dd_distT.innerHTML = `${item.distT / 1000}`;
				dd_distH.innerHTML = `${item.distH / 1000}`;
				dd_distS.innerHTML = `${item.distS / 1000}`;
				dd_a.innerHTML = `${item.a}`;

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

				options = {
					color: "blue",
					popup: `<ol style="list-style-type:none;"><li>${item.pref}</li><li>緯度：${item.lat}</li><li>経度：${item.lon}</li></ol>`,
				};
				oAppMaps.point(item.lat, item.lon, options);

				options = {
					color: "green",
					popup: `<ol style="list-style-type:none;"><li>${item.pref}</li><li>${item_base.pref}から距離[${item.distH}m],方角[${item.a}]で求めた地点</li></ol>`,
				};
				oAppMaps.point(item.c_lat, item.c_lon, options);

				const atob: number[][] = [];
				atob.push([item_base.lat, item_base.lon]);
				atob.push([item.lat, item.lon]);

				options = {
					color: "#4169e1",
					popup: `<ol style="list-style-type:none;"><li>${item_base.pref}→${
						item.pref
					}</li><li>距離：${item.distH.toLocaleString()}</li><li>方角：${item.a}</li></ol>`,
				};
				oAppMaps.arc(atob, options);
			}
		});
	}

	return (
		<>
			<div>
				<a href="http://www.gsi.go.jp/common/000195510.pdf" target="_blank">
					国土地理院：都道府県庁間の距離（2018/01/15）
				</a>
			</div>
			｜&emsp;と比較すると、
			<br />
			↓&emsp;ヒュベニによる計算が国土地理の計算とほぼ一致
			<br />
			<div className="contentsDistanceTable">
				<div id="appDistance" className="contentsDistanceTableWidth">
					<div>{item_base.pref}からの距離</div>
				</div>
			</div>
			<div id="appDistanceMap"></div>
		</>
	);
};

export default ViewMapsDistance;
