// npm install --save-dev react @types/react
import React from "react";
import { maps, mapsDataGpx } from "../ts/maps";
import { mapsDataGpxChart } from "../ts/mapsGpxChart";

// npm install --save react-dropzone
import Dropzone, { DropzoneRef } from "react-dropzone";

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
	// Dropzone
	private oDropzone: React.RefObject<DropzoneRef> = React.createRef();

	/**
	 * コンストラクター
	 * @param props
	 */
	constructor(props: IndexViewGpxProps) {
		super(props);
	}

	/**
	 * イベント：GPX ファイル選択
	 * @param o select
	 */
	private eChange(o: React.ChangeEvent<HTMLSelectElement>): void {
		const fname = `${this.vDir}${o.target.value}`;
		this.draw(fname === "未選択" ? "" : fname);
	}

	/**
	 * イベント：ファイルアップロード
	 * @param files File
	 */
	private eFile(files: File[]): void {
		files.forEach((file: File) => {
			const reader: FileReader = new FileReader();
			reader.addEventListener("loadend", this.eFileLoad.bind(this, file.name, reader));
			reader.readAsText(file);
		});
	}

	/**
	 * イベント：ファイルアップロード：loadend
	 * @param fname ファイル名
	 * @param reader FileReader
	 */
	private eFileLoad(fname: string, reader: FileReader): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const txt: any = reader.result;
		this.drawData(new mapsDataGpx(fname, txt));
	}

	/**
	 * GPX Chart の描画
	 * @param fname ファイル名
	 */
	private draw(fname: string): void {
		if (!fname) {
			return;
		}

		const oMaps: maps = new maps();
		void oMaps.gpx(fname).then((data: mapsDataGpx) => {
			this.drawData(data);
		});
	}

	/**
	 * GPX Chart の描画
	 * @param data データ
	 */
	private drawData(data: mapsDataGpx): void {
		if (this.oChart.current) {
			const o: mapsDataGpxChart = new mapsDataGpxChart(this.oChart.current, data);
			o.refresh(this.props.w, this.props.h, this.props.xw);
		}
		if (this.oChartTitle.current) {
			this.oChartTitle.current.innerHTML = data.getName();
		}
	}

	render(): JSX.Element {
		return (
			<div>
				<select className="contentsSelect" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.eChange(e)}>
					<option>未選択</option>
					<option>20190519.gpx</option>
					<option>20190428.gpx</option>
					<option>20180811.gpx</option>
				</select>
				<Dropzone ref={this.oDropzone} accept=".gpx" onDrop={(e: File[]) => this.eFile(e)}>
					{
						({getRootProps, getInputProps}) => (
							<div className="contentsUpload" {...getRootProps()}>
								<input {...getInputProps()} />
								<div>GPXファイル（*.gpx）をアップロード</div>
							</div>
						)
					}
				</Dropzone>
				<div ref={this.oChartTitle}></div>
				<div ref={this.oChart}></div>
			</div>
		);
	}
}
