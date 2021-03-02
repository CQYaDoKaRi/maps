// npm install --save-dev react @types/react
import React, { useState } from "react";
import ViewMenu, { ViewMenuTitle } from "./ViewMenu";

/**
 * React Component - View - props
 */
type Props = {
	// タイトル
	titles: ViewMenuTitle[];
	// タイトルキー（選択値）
	titleKey: string;
	// イベント
	onChange: (titleKey: string) => void;
};

/**
 * React Component - View
 * @param props props
 */
const View: React.FC<Props> = (props) => {
	// state
	const [titleKey, setTitleKey] = useState(props.titleKey);

	/**
	 * イベント：メニュー
	 * @param key 選択値
	 */
	const eChangeMenu = (key: string) => {
		setTitleKey(key);
		props.onChange(key);
	};

	return (
		<>
			<ViewMenu titles={props.titles} titleKey={titleKey} onChange={eChangeMenu} />
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
			<div id="DataGpx" className="contents">
				<div id="appDataGpxTitleSub"></div>
				<div id="appDataGpx"></div>
			</div>
			<div id="MongoDB" className="contents">
				<div id="appMongoDBMap"></div>
			</div>
		</>
	);
};

export default View;
