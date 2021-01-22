// npm install --save-dev @types/react
/// <reference path="../../node_modules/@types/react/index.d.ts" />
// npm install --save-dev @types/react-dom
/// <reference path="../../node_modules/@types/react-dom/index.d.ts" />

/**
 * React Component - IndexViewContents
 */
class IndexViewContents extends React.Component {
	render(){
		return(
			<>
			<div id="Distance" className="contents">
				■　２地点間の距離を求める<br />
				<div>
					<a href="http://www.gsi.go.jp/common/000195510.pdf" target="_blank">国土地理院：都道府県庁間の距離（2018/01/15）</a>
				</div>
				｜　と比較すると、<br />
				↓　ヒュベニによる計算が国土地理の計算とほぼ一致します。<br />
				<div className="contentsDistanceTable">
					<div id="appDistance" className="contentsDistanceTableWidth"></div>
				</div>
				<div id="appDistanceMap"></div>
			</div>
			<div id="DistanceTo" className="contents">
				■　ある地点から角度と距離を指定して地点を求める<br />
				<div>
					<a href="http://www.gsi.go.jp/common/000195510.pdf" target="_blank">国土地理院：都道府県庁間の距離（2018/01/15）</a>
				</div>
				｜　と比較すると、<br />
				↓　ヒュベニによる計算が国土地理の計算とほぼ一致します。<br />
				<div>
					<div className="contentsDistanceTable">
						<div id="appDistanceTo" className="contentsDistanceTableWidthTo"></div>
					</div>
					<div id="appDistanceToMap"></div>
				</div>
			</div>
			<div id="Scale" className="contents">
				■　<span id="appScaleTitle"></span><br />
				<div id="appScaleTitleSub"></div>
				<div id="appScale"></div>
			</div>
			<div id="Tile" className="contents">
				■　<span id="appTileTitle"></span><br />
				<div id="appTileTitleSub"></div>
				<div id="appTile"></div>
			</div>
			<div id="DataGpx" className="contents">
				■　<span id="appDataGpxTitle"></span><br />
				<div id="appDataGpxTitleSub"></div>
				<div id="appDataGpx"></div>
			</div>
			</>
		);
	}
}