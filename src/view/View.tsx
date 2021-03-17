// npm install --save-dev react @types/react
import React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./RStoreView";

import dynamic from "next/dynamic";

import ViewMenu, { ViewMenuTitle } from "./ViewMenu";
const ViewMapsDistance = dynamic(() => import("./ViewMapsDistance"), { ssr: false });
import ViewMapsScale from "./ViewMapsScale";
import ViewMapsTile from "./ViewMapsTile";
import ViewMapsDataGpx from "./ViewMapsDataGpx";
const ViewMapsMongoDB = dynamic(() => import("./ViewMapsMongoDB"), { ssr: false });

/**
 * React Component - View - props
 */
type Props = {
	// APIベースURL
	api: string;
	// タイトル：データ
	titleData: ViewMenuTitle[];
	// mapStateToProps
	storeKey: string;
	// mapDispatchToProps
	storeSetKey: (key: string) => void;
};

/**
 * React Component - View
 * @param props props
 */
const View: React.FC<Props> = (props) => {
	// 設定：地図：初期表示設定
	const vMapLat = 35.681236;
	const vMapLon = 139.767125;
	const vMapZ = 5;
	// 設定：地図：日本経緯度原点（東京都港区麻布台2 - 18 - 1）
	const vMapBaseLat = 35.65809922;
	const vMapBaseLon = 139.741357472;
	// 設定：地図：富士山頂
	const vMapTileLat = 35.360771305;
	const vMapTileLon = 138.7273035;
	// 設定 - 解像度
	const vMapDPI = 96;
	// 設定：GPX
	const vGpxAPI = `${props.api}api/view/gpx/files`;
	const vGpxChartW = 1100;
	const vGpxhartH = 500;
	const vGpxhartXW = 150;

	/**
	 * イベント：メニュー
	 * @param key 選択値
	 */
	const eChangeMenu = (key: string) => {
		props.storeSetKey(key);
	};

	return (
		<>
			<ViewMenu titleData={props.titleData} titleKey={props.storeKey} onChange={eChangeMenu} />
			{props.storeKey === "Distance" && <ViewMapsDistance mapLat={vMapLat} mapLon={vMapLon} mapZ={vMapZ} />}
			{props.storeKey === "Scale" && <ViewMapsScale lat={vMapBaseLat} lon={vMapBaseLon} dpi={vMapDPI} />}
			{props.storeKey === "Tile" && <ViewMapsTile lat={vMapTileLat} lon={vMapTileLon} dpi={vMapDPI} />}
			{props.storeKey === "DataGpx" && <ViewMapsDataGpx api={vGpxAPI} w={vGpxChartW} h={vGpxhartH} xw={vGpxhartXW} />}
			{props.storeKey === "MongoDB" && <ViewMapsMongoDB mapLat={vMapLat} mapLon={vMapLon} mapZ={vMapZ} />}
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
