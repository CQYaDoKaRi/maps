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
	const vExt = "gpx";
	const vNameDefault = "[未選択]";
	const vNameDropzone = "[アップロード]";

	// state
	const [gpx, setGpx] = useState<ViewMapsDataGpxState[]>([{ fname: "", data: "" }]);
	const [fileSelect, setFileSelect] = useState(vNameDropzone ? vNameDropzone : vNameDefault);
	const [dropzone, setDropzone] = useState(vNameDropzone ? true : false);

	/**
	 * state - set
	 * @param fname ファイル名
	 * @param data GPX TEXT データ
	 */
	const stateGpxSet = (fname: string) => {
		setGpx([{ fname: fname, data: "" }]);
	};

	// event - state - dropzone
	let nStateGpxDropzone = 0;
	let eStateGpxDropzone: ViewMapsDataGpxState[] = [];
	/**
	 * event - state - dropzone - init
	 * @param n ファイル数
	 */
	const eStateGpxDropzoneInit = (n: number) => {
		nStateGpxDropzone = n;
		eStateGpxDropzone = [];
	};

	/**
	 * イベント：GPX ファイル選択
	 * @param value 選択値
	 */
	const eChange = (value: string) => {
		setFileSelect(value);

		const extN = value.indexOf(".");
		const ext = extN > 0 ? value.slice(extN + 1).toLowerCase() : "";

		let fname = "";
		let upload = false;
		if (ext === vExt) {
			fname = `${vDir}${value}`;
		} else if (value === vNameDropzone) {
			upload = true;
		}

		stateGpxSet(fname);
		setDropzone(upload);
	};

	/**
	 * イベント：ファイルアップロード
	 * @param accepted 処理対象ファイル
	 * @param rejected 処理非対象ファイル
	 */
	const eFile = (accepted: File[], rejected: FileRejection[]) => {
		rejected.map((file: FileRejection) => {
			console.error(`[GPX-dropzone] rejected[${file.file.name}]`);
		});

		eStateGpxDropzoneInit(accepted.length);

		accepted.map((file: File) => {
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
		eStateGpxDropzone.push({ fname: fname, data: reader.result as string });
		if (eStateGpxDropzone.length === nStateGpxDropzone) {
			setGpx(eStateGpxDropzone);
		}
	};

	return (
		<div>
			<ViewMapsDataGpxFileSelect
				nameDefault={vNameDefault}
				nameDropzone={vNameDropzone}
				value={fileSelect}
				refresh={true}
				onChange={(value: string) => {
					eChange(value);
				}}
			/>
			{dropzone && (
				<ViewMapsDataGpxFileDropzone
					onDrop={(accepted: File[], rejected: FileRejection[]) => {
						eFile(accepted, rejected);
					}}
				/>
			)}
			{gpx.map((item: ViewMapsDataGpxState, index: number) => (
				<ViewMapsDataGpxChart key={index} w={props.w} h={props.h} xw={props.xw} gpx={item} />
			))}
		</div>
	);
};

export default ViewMapsDataGpx;
