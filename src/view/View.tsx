// npm install --save-dev react @types/react
import React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./RStoreView";
import ViewMenu, { ViewMenuTitle } from "./ViewMenu";
import ViewMapsDistance from "./ViewMapsDistance";
import ViewMapsScale from "./ViewMapsScale";
import ViewMapsTile from "./ViewMapsTile";
import ViewMapsDataGpx from "./ViewMapsDataGpx";

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
	// 設定
	const vMapLat = 35.681236;
	const vMapLon = 139.767125;
	const vMapBaseLat = 35.65809922; // 日本経緯度原点（東京都港区麻布台2 - 18 - 1）
	const vMapBaseLon = 139.741357472; // 日本経緯度原点（東京都港区麻布台2 - 18 - 1）
	const vMapTileLat = 35.360771305; // 富士山頂
	const vMapTileLon = 138.7273035; // 富士山頂
	const vMapDPI = 96;
	const vMapZ = 5;
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
			<div id="MongoDB" className="contents">
				<div id="appMongoDBMap"></div>
			</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
