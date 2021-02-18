// npm install --save-dev react @types/react
import React from "react";

/**
 * React Component - IndexViewContents
 */
export class IndexViewContents extends React.Component {
	render(): JSX.Element {
		return (
			<>
				<div id="Distance" className="contents">
					■&emsp;<span id="appDistanceTitle"></span>
					<br />
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
					■&emsp;<span id="appScaleTitle"></span>
					<br />
					<div id="appScaleTitleSub"></div>
					<div id="appScale"></div>
				</div>
				<div id="Tile" className="contents">
					■&emsp;<span id="appTileTitle"></span>
					<br />
					<div id="appTileTitleSub"></div>
					<div id="appTile"></div>
				</div>
				<div id="DataGpx" className="contents">
					■&emsp;<span id="appDataGpxTitle"></span>
					<br />
					<div id="appDataGpxTitleSub"></div>
					<div id="appDataGpx"></div>
				</div>
				<div id="MongoDB" className="contents">
					■&emsp;<span id="appMongoDBTitle"></span>
					<br />
					<div id="appMongoDBMap"></div>
				</div>
			</>
		);
	}
}
