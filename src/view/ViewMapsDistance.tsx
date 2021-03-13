// npm install --save-dev react @types/react
import React, { useRef, useEffect } from "react";
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
	// 設定：都道府県番号
	const vPrefN = 12;

	// オブジェクト
	const oMap = useRef(null);

	// 地図
	const oMaps: maps = new maps();

	// 地図データ：都道府県庁
	const oMapsDataPrefCapital: mapsDataPrefCapital = new mapsDataPrefCapital();
	const dMapsDataPrefCapital: mapsDataPrefCapitalItem[] = oMapsDataPrefCapital.get();
	const dMapsDataPrefCapitalBase = dMapsDataPrefCapital[vPrefN];

	/**
	 * 都道府県県庁データから距離と角度を算出
	 * @param item 都道府県県庁データ
	 * @returns 距離と角度を算出した都道府県県庁データ
	 */
	const dataPrefCapitalItem = (item: mapsDataPrefCapitalItem): mapsDataPrefCapitalItem => {
		const c: mapsLatLon = oMaps.distanceTo(
			dMapsDataPrefCapitalBase.lat,
			dMapsDataPrefCapitalBase.lon,
			item.a,
			item.distH
		);

		return {
			pref: item.pref,
			addr: item.addr,
			lat: item.lat,
			lon: item.lon,
			distT: oMaps.distanceT(dMapsDataPrefCapitalBase.lat, dMapsDataPrefCapitalBase.lon, item.lat, item.lon),
			distH: oMaps.distanceH(dMapsDataPrefCapitalBase.lat, dMapsDataPrefCapitalBase.lon, item.lat, item.lon),
			distS: oMaps.distanceS(dMapsDataPrefCapitalBase.lat, dMapsDataPrefCapitalBase.lon, item.lat, item.lon),
			a: oMaps.direction(dMapsDataPrefCapitalBase.lat, dMapsDataPrefCapitalBase.lon, item.lat, item.lon),
			c_lat: c.lat,
			c_lon: c.lon,
		};
	};

	useEffect(() => {
		const _MapOptions = {
			w: 100,
			wUnit: "%",
			h: 600,
			hUnit: "px",
		};

		const oDiv = (oMap.current as unknown) as HTMLElement;
		const oAppMaps = new appMaps(oDiv.id, props.mapLat, props.mapLon, props.mapZ, _MapOptions);
		oAppMaps.layerBase();

		dMapsDataPrefCapital.map((item: mapsDataPrefCapitalItem) => {
			item = dataPrefCapitalItem(item);

			let options = {
				color: "blue",
				popup: `<ol style="list-style-type:none;"><li>${item.pref}</li><li>緯度：${item.lat}</li><li>経度：${item.lon}</li></ol>`,
			};
			oAppMaps.point(item.lat, item.lon, options);

			options = {
				color: "green",
				popup: `<ol style="list-style-type:none;"><li>${item.pref}</li><li>${dMapsDataPrefCapitalBase.pref}から距離[${item.distH}m],方角[${item.a}]で求めた地点</li></ol>`,
			};
			oAppMaps.point(item.c_lat, item.c_lon, options);

			const atob: number[][] = [];
			atob.push([dMapsDataPrefCapitalBase.lat, dMapsDataPrefCapitalBase.lon]);
			atob.push([item.lat, item.lon]);

			options = {
				color: "#4169e1",
				popup: `<ol style="list-style-type:none;"><li>${dMapsDataPrefCapitalBase.pref}→${
					item.pref
				}</li><li>距離：${item.distH.toLocaleString()}</li><li>方角：${item.a}</li></ol>`,
			};
			oAppMaps.arc(atob, options);
		});
	}, []);

	return (
		<div className="contentsDistance">
			<div>
				<a href="http://www.gsi.go.jp/common/000195510.pdf" target="_blank">
					国土地理院：都道府県庁間の距離（2018/01/15）
				</a>
			</div>
			↓ &emsp;と比較すると、ヒュベニによる計算が国土地理の計算とほぼ一致
			<br />
			<div className="contentsDistanceTable">
				<div id="appDistance" className="contentsDistanceTableWidth">
					<div>{dMapsDataPrefCapitalBase.pref}からの距離</div>
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
					{dMapsDataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number) => {
						if (n !== vPrefN) {
							item = dataPrefCapitalItem(item);

							return (
								<dl key={n}>
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
			<div ref={oMap} id="appDistanceMap"></div>
		</div>
	);
};

export default ViewMapsDistance;
