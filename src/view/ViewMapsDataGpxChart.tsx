// npm install --save-dev react @types/react
import React, { useRef, useState } from "react";
import { maps, mapsDataGpx } from "../ts/maps";
import { mapsDataGpxChart } from "../ts/mapsGpxChart";

/**
 * React Component - ViewMapsDataGpxChart - props
 */
type Props = {
	// 幅[px]
	w: number;
	// 高[px]
	h: number;
	// 横グリッド幅[px]
	xw: number;
	// データ
	gpx: {
		// ファイル名
		fname: string;
		// データ(Text)
		data: string;
	};
};

/**
 * React Component - ViewMapsDataGpxChart
 * @param props props
 */
const ViewMapsDataGpxChart: React.FC<Props> = (props) => {
	const oChart = useRef(null);

	// state
	const [title, setTitle] = useState("");

	/**
	 * GPX Chart の描画
	 * @param fname ファイル名
	 */
	const draw = (fname: string) => {
		if (!fname) {
			return;
		}

		const oMaps: maps = new maps();
		void oMaps.gpx(fname).then((data: mapsDataGpx) => {
			drawChart(data);
		});
	};

	/**
	 * GPX Chart の描画
	 * @param fname ファイル名
	 * @param txt GPX テキストデータ
	 */
	const drawData = (fname: string, txt: string) => {
		drawChart(new mapsDataGpx(fname, txt));
	};

	/**
	 * GPX Chart の描画
	 * @param data データ
	 */
	const drawChart = (data: mapsDataGpx) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const oDiv: any = oChart.current;
		const o: mapsDataGpxChart = new mapsDataGpxChart(oDiv, data);
		o.refresh(props.w, props.h, props.xw);

		setTitle(data.getName());
	};

	/**
	 * React：useEffect：props.gpx
	 */
	React.useEffect(() => {
		if (!props.gpx.fname) {
			return;
		}
		if (props.gpx.data) {
			drawData(props.gpx.fname, props.gpx.data);
		} else {
			draw(props.gpx.fname);
		}
	}, [props.gpx]);

	return (
		<>
			<div className="contentsGpxFname" style={{ display: props.gpx.fname ? "block" : "none" }}>
				{title}
			</div>
			<div className="contentsGpxChart">
				<div ref={oChart} style={{ display: props.gpx.fname ? "block" : "none" }} />
			</div>
		</>
	);
};

export default ViewMapsDataGpxChart;
