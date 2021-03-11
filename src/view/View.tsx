// npm install --save-dev react @types/react
import React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./RStoreView";
import ViewMenu, { ViewMenuTitle } from "./ViewMenu";
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
			<div id="Distance" className="contents">
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
					<div id="appDistance" className="contentsDistanceTableWidth"></div>
				</div>
				<div id="appDistanceMap"></div>
			</div>
			<div id="Scale" className="contents">
				<div id="appScaleTitleSub"></div>
				<div id="appScale"></div>
			</div>
			<div id="Tile" className="contents">
				<div id="appTileTitleSub"></div>
				<div id="appTile"></div>
			</div>
			{props.storeKey === "DataGpx" && <ViewMapsDataGpx api={vGpxAPI} w={vGpxChartW} h={vGpxhartH} xw={vGpxhartXW} />}
			<div id="MongoDB" className="contents">
				<div id="appMongoDBMap"></div>
			</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
