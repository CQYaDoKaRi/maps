// npm install --save-dev react @types/react
import React from "react";
import ViewMapsDataGpxFileSelect from "./ViewMapsDataGpxFileSelect";
import ViewMapsDataGpxFileDropzone from "./ViewMapsDataGpxFileDropzone";
import ViewMapsDataGpxChart from "./ViewMapsDataGpxChart";

// npm install --save react-dropzone
import { FileRejection } from "react-dropzone";

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
 * React Component - IndexViewGpx - Status
 */
type IndexViewGpxStatus = {
	// データ：GPX
	Data: {
		// ファイル名
		fname: string;
		// TEXT データ
		data: string;
	};
};

/**
 * React Component - IndexViewGpx
 */
export class IndexViewGpx extends React.Component<IndexViewGpxProps, IndexViewGpxStatus> {
	// フォルダ
	private vDir = "./data/";

	/**
	 * コンストラクター
	 * @param props
	 */
	constructor(props: IndexViewGpxProps) {
		super(props);

		this.state = {
			Data: {
				fname: "",
				data: "",
			},
		};
	}

	/**
	 * イベント：GPX ファイル選択
	 * @param o select
	 */
	private eChange(o: React.ChangeEvent<HTMLSelectElement>): void {
		const value = o.target.value === "未選択" ? "" : o.target.value;
		let fname = "";
		if (value) {
			fname = `${this.vDir}${o.target.value}`;
		}

		this.setState({
			Data: {
				fname: fname,
				data: "",
			},
		});
	}

	/**
	 * イベント：ファイルアップロード
	 * @param accepted 処理対象ファイル
	 * @param rejected 処理非対象ファイル
	 */
	private eFile(accepted: File[], rejected: FileRejection[]): void {
		if (rejected.length > 0) {
			this.setState({
				Data: {
					fname: "",
					data: "",
				},
			});
			return;
		}

		accepted.forEach((file: File) => {
			const reader: FileReader = new FileReader();
			reader.addEventListener("loadend", this.eFileLoad.bind(this, file.name, reader));
			reader.readAsText(file);
		});
	}

	/**
	 * イベント：ファイルアップロード：loadend
	 * @param fname ファイル名
	 * @param reader GPX データ
	 */
	private eFileLoad(fname: string, reader: FileReader): void {
		this.setState({
			Data: {
				fname: fname,
				data: reader.result as string,
			},
		});
	}

	render(): JSX.Element {
		return (
			<div>
				<ViewMapsDataGpxFileSelect
					refresh={true}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
						this.eChange(e);
					}}
				/>
				<ViewMapsDataGpxFileDropzone
					onDrop={(accepted: File[], rejected: FileRejection[]) => {
						this.eFile(accepted, rejected);
					}}
				/>
				<ViewMapsDataGpxChart w={this.props.w} h={this.props.h} xw={this.props.xw} gpx={this.state.Data} />
			</div>
		);
	}
}
