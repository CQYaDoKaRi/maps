// npm install --save-dev react @types/react
import React, { useState } from "react";
import ViewMapsDataGpxFileSelect from "./ViewMapsDataGpxFileSelect";
import ViewMapsDataGpxFileDropzone from "./ViewMapsDataGpxFileDropzone";
import ViewMapsDataGpxChart from "./ViewMapsDataGpxChart";

// npm install --save react-dropzone
import { FileRejection } from "react-dropzone";

/**
 * React Component - ViewMapsDataGpx - props
 */
type Props = {
	// 幅[px]
	w: number;
	// 高[px]
	h: number;
	// 横グリッド幅[px]
	xw: number;
};

/**
 * React Component - ViewMapsDataGpx - state - GPX
 */
type ViewMapsDataGpxState = {
	// ファイル名
	fname: string;
	// テキストデータ
	data: string;
};

/**
 * React Component - ViewMapsDataGpx
 * @param props props
 */
const ViewMapsDataGpx: React.FC<Props> = (props) => {
	// フォルダ
	const vDir = "./data/";

	// state - GPX
	const [gpx, setGpx] = useState<ViewMapsDataGpxState>({ fname: "", data: "" });

	/**
	 * state - GPX
	 * @param fname ファイル名
	 * @param data GPX TEXT データ
	 */
	const stateGpx = (fname: string, data: string) => {
		setGpx({ fname: fname, data: data });
	};

	/**
	 * イベント：GPX ファイル選択
	 * @param o select
	 */
	const eChange = (o: React.ChangeEvent<HTMLSelectElement>) => {
		const value = o.target.value === "未選択" ? "" : o.target.value;
		let fname = "";
		if (value) {
			fname = `${vDir}${o.target.value}`;
		}

		stateGpx(fname, "");
	};

	/**
	 * イベント：ファイルアップロード
	 * @param accepted 処理対象ファイル
	 * @param rejected 処理非対象ファイル
	 */
	const eFile = (accepted: File[], rejected: FileRejection[]) => {
		if (rejected.length > 0) {
			stateGpx("", "");
			return;
		}

		accepted.forEach((file: File) => {
			const reader: FileReader = new FileReader();
			reader.addEventListener("loadend", eFileLoad.bind(this, file.name, reader));
			reader.readAsText(file);
		});
	};

	/**
	 * イベント：ファイルアップロード：loadend
	 * @param fname ファイル名
	 * @param reader GPX データ
	 */
	const eFileLoad = (fname: string, reader: FileReader) => {
		stateGpx(fname, reader.result as string);
	};

	return (
		<div>
			<ViewMapsDataGpxFileSelect
				refresh={true}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					eChange(e);
				}}
			/>
			<ViewMapsDataGpxFileDropzone
				onDrop={(accepted: File[], rejected: FileRejection[]) => {
					eFile(accepted, rejected);
				}}
			/>
			<ViewMapsDataGpxChart w={props.w} h={props.h} xw={props.xw} gpx={gpx} />
		</div>
	);
};

export default ViewMapsDataGpx;
