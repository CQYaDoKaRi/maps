// npm install --save-dev react @types/react
import React from "react";
import { maps, mapsLatLon, mapsTile, mapsTileDem, mapsDataGpx } from "../ts/maps";
import { mapsDataGpxChart } from "../ts/mapsGpxChart";

/**
 * React Component - IndexViewGpx - props
 */
type IndexViewGpxProps = {
	// 幅[px]
	w: number;
	// 高[px]
	h: number;
	// 横グリッド幅[px]
	xw: number;
};

/**
 * React Component - IndexViewGpx
 */
export class IndexViewGpx extends React.Component<IndexViewGpxProps> {
	// フォルダ
	private vDir = "./data/";
	// GPX Chart
	private oChart: React.RefObject<HTMLDivElement> = React.createRef();
	// GPX Chart - タイトル
	private oChartTitle: React.RefObject<HTMLDivElement> = React.createRef();

	/**
	 * コンストラクター
	 * @param props
	 */
	constructor(props: IndexViewGpxProps) {
		super(props);
	}

	private eChange(o: React.ChangeEvent<HTMLSelectElement>): void {
		const fname = `${this.vDir}${o.target.value}`;
		this.draw(fname === "未選択" ? "" : fname);
	}

	private draw(fname: string): void {
		if (!fname) {
			return;
		}

		const oMaps: maps = new maps();
		void oMaps.gpx(fname).then((data: mapsDataGpx) => {
			if (this.oChart.current) {
				const o: mapsDataGpxChart = new mapsDataGpxChart(this.oChart.current, data);
				o.refresh(this.props.w, this.props.h, this.props.xw);
			}
			if (this.oChartTitle.current) {
				this.oChartTitle.current.innerHTML = data.getName();
			}
		});
	}

	render(): JSX.Element {
		return (
			<div>
				<select className="contentsSelect" onChange={(e) => this.eChange(e)}>
					<option>未選択</option>
					<option>20190519.gpx</option>
					<option>20190428.gpx</option>
					<option>20180811.gpx</option>
				</select>
				<div className="contentsUpload">GPXファイルをドラッグしてアップロード</div>
				<div ref={this.oChartTitle}></div>
				<div ref={this.oChart}></div>
			</div>
		);
	}
}
