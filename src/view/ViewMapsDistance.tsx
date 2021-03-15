// npm install --save-dev react @types/react
import React, { useState, useRef, useEffect } from "react";
// npm install --save-dev react-bootstrap bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";

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
	// state - データ
	const oMapsDataPrefCapital = new mapsDataPrefCapital();
	const [dataPrefCapital] = useState<mapsDataPrefCapitalItem[]>(oMapsDataPrefCapital.get());
	const [dataPrefCapitalBase, setDataPrefCapitalBase] = useState(dataPrefCapital[12]);
	// state - 地図
	const [oAppMaps, setAppMaps] = useState<appMaps | undefined>(undefined);

	// オブジェクト
	const oMap = useRef(null);

	/**
	 * 都道府県県庁データから距離と角度を算出
	 * @param item 都道府県県庁データ
	 * @returns 距離と角度を算出した都道府県県庁データ
	 */
	const dataPrefCapitalItem = (item: mapsDataPrefCapitalItem): mapsDataPrefCapitalItem => {
		const oMaps: maps = new maps();
		const c: mapsLatLon = oMaps.distanceTo(dataPrefCapitalBase.lat, dataPrefCapitalBase.lon, item.a, item.distH);

		return {
			pref: item.pref,
			addr: item.addr,
			lat: item.lat,
			lon: item.lon,
			distT: oMaps.distanceT(dataPrefCapitalBase.lat, dataPrefCapitalBase.lon, item.lat, item.lon),
			distH: oMaps.distanceH(dataPrefCapitalBase.lat, dataPrefCapitalBase.lon, item.lat, item.lon),
			distS: oMaps.distanceS(dataPrefCapitalBase.lat, dataPrefCapitalBase.lon, item.lat, item.lon),
			a: oMaps.direction(dataPrefCapitalBase.lat, dataPrefCapitalBase.lon, item.lat, item.lon),
			c_lat: c.lat,
			c_lon: c.lon,
		};
	};

	/**
	 * イベント：都道府県県庁の選択
	 * @param index 都道府県県庁データインデックス
	 */
	const onChange = (index: number) => {
		setDataPrefCapitalBase(dataPrefCapital[index]);
	};

	useEffect(() => {
		const _MapOptions = {
			w: 100,
			wUnit: "%",
			h: 600,
			hUnit: "px",
		};

		// 地図：初期化
		const oDiv = (oMap.current as unknown) as HTMLElement;
		const oAppMaps = new appMaps(oDiv.id, props.mapLat, props.mapLon, props.mapZ, _MapOptions);
		setAppMaps(oAppMaps);
	}, []);

	useEffect(() => {
		if (oAppMaps) {
			// 地図：表示
			mapView(oAppMaps);
		}
	}, [oAppMaps, dataPrefCapitalBase]);

	/**
	 * 地図表示
	 * @param oAppMaps appMaps(leaflet)
	 */
	const mapView = (oAppMaps: appMaps) => {
		if (oAppMaps) {
			oAppMaps.clear();
			oAppMaps.layerBase();

			dataPrefCapital.map((item: mapsDataPrefCapitalItem) => {
				item = dataPrefCapitalItem(item);
				let options = {
					color: "blue",
					popup: `<ol style="list-style-type:none;"><li>${item.pref}</li><li>緯度：${item.lat}</li><li>経度：${item.lon}</li></ol>`,
				};
				oAppMaps.point(item.lat, item.lon, options);

				options = {
					color: "green",
					popup: `<ol style="list-style-type:none;"><li>${item.pref}</li><li>${dataPrefCapitalBase.pref}から距離[${item.distH}m],方角[${item.a}]で求めた地点</li></ol>`,
				};
				oAppMaps.point(item.c_lat, item.c_lon, options);

				const atob: number[][] = [];
				atob.push([dataPrefCapitalBase.lat, dataPrefCapitalBase.lon]);
				atob.push([item.lat, item.lon]);

				options = {
					color: "#4169e1",
					popup: `<ol style="list-style-type:none;"><li>${dataPrefCapitalBase.pref}→${
						item.pref
					}</li><li>距離：${item.distH.toLocaleString()}</li><li>方角：${item.a}</li></ol>`,
				};
				oAppMaps.arc(atob, options);
			});
		}
	};

	return (
		<div className="contentsDistance">
			<div>
				<div style={{ float: "left" }}>
					<DropdownButton title={dataPrefCapitalBase.pref}>
						{dataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number) => {
							return (
								<Dropdown.Item
									key={n}
									active={dataPrefCapitalBase.pref === item.pref}
									onSelect={() => {
										onChange(n);
									}}
								>
									{item.pref}
								</Dropdown.Item>
							);
						})}
					</DropdownButton>
				</div>
				<div style={{ paddingTop: "5px" }}>
					&ensp;からの距離 （ヒュベニの計算結果が{" "}
					<a href="http://www.gsi.go.jp/common/000195510.pdf" target="_blank">
						国土地理院：都道府県庁間の距離（2018/01/15）
					</a>{" "}
					とほぼ一致）
				</div>
			</div>
			<hr />
			<div className="contentsDistanceTable">
				<div id="appDistance" className="contentsDistanceTableWidth">
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
					{dataPrefCapital.map((item: mapsDataPrefCapitalItem, n: number) => {
						if (dataPrefCapitalBase.pref !== item.pref) {
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
