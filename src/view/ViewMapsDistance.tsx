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

	const oMaps: maps = new maps();

	const _MapLat = props.mapLat;
	const _MapLon = props.mapLon;
	const _MapZ = props.mapZ;
	const _MapOptions = {
		w: 100,
		wUnit: "%",
		h: 600,
		hUnit: "px",
	};

	const base = 12;
	const item_base = dmapsDataPrefCapital[base];

	// FIXME:地図表示を実装する
	const oAppMaps = new appMaps("appDistanceMap", _MapLat, _MapLon, _MapZ, _MapOptions);
	oAppMaps.layerBase();

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
					<dl>
						<dt>県庁</dt>
						<dd>緯度</dd>
						<dd>経度</dd>
						<dd>
							距離
							<br />
							（三角球面法）
						</dd>
						<dd>
							距離
							<br />
							（ヒュベニ）
						</dd>
						<dd>
							距離
							<br />
							（測地線航海算法）
						</dd>
						<dd>方角</dd>
						<dd>
							経度を算出=
							<br />
							方角＋距離
							<br />
							（ヒュベニ）
						</dd>
						<dd>
							経度を算出=
							<br />
							方角＋距離
							<br />
							（ヒュベニ）
						</dd>
					</dl>
					{dmapsDataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number) => {
						if (n !== base) {
							item.distT = oMaps.distanceT(item_base.lat, item_base.lon, item.lat, item.lon);
							item.distH = oMaps.distanceH(item_base.lat, item_base.lon, item.lat, item.lon);
							item.distS = oMaps.distanceS(item_base.lat, item_base.lon, item.lat, item.lon);
							item.a = oMaps.direction(item_base.lat, item_base.lon, item.lat, item.lon);

							const c: mapsLatLon = oMaps.distanceTo(item_base.lat, item_base.lon, item.a, item.distH);
							item.c_lat = c.lat;
							item.c_lon = c.lon;

							// FIXME:地図表示を実装する
							if (oAppMaps) {
								let options = {
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

							return (
								<dl>
									<dt>{item.pref}</dt>
									<dd>{item.lat}</dd>
									<dd>{item.lon}</dd>
									<dd>{item.distT / 1000}</dd>
									<dd>{item.distH / 1000}</dd>
									<dd>{item.distS / 1000}</dd>
									<dd>{item.a}</dd>
									<dd>{item.c_lat}</dd>
									<dd>{item.c_lon}</dd>
								</dl>
							);
						}
					})}
				</div>
			</div>
			<div id="appDistanceMap"></div>
		</>
	);
};

export default ViewMapsDistance;
