// npm install --save-dev react @types/react
import React, { useState } from "react";

interface gpxFile {
	name: string;
	size: number;
	date: string;
}

/**
 * React Component - ViewMapsDataGpxFileSelect - props
 */
type Props = {
	// 更新
	refresh: boolean;
	// イベント
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * React Component - ViewMapsDataGpxFileSelect
 * @param props props
 */
const ViewMapsDataGpxFileSelect: React.FC<Props> = (props) => {
	// option - 初期値
	const optionDefault: gpxFile = { name: "未選択", size: 0, date: "" };

	// state
	const [files, setTiles] = useState<gpxFile[]>([optionDefault]);

	/**
	 * React Component - useEffect - props.refresh
	 */
	React.useEffect(() => {
		if (props.refresh) {
			fetch("api/view/gpx/files", {
				method: "GET",
			})
				.then((response) => {
					if (response.status === 200) {
						void response.json().then((files: gpxFile[]) => {
							if (files) {
								files.unshift(optionDefault);
							} else {
								files = [];
								files.push(optionDefault);
							}
							setTiles(files);
						});
					}
				})
				.catch(() => {
					console.log("[api]=[api/view/gpx/files] request error.");
				});
		}
	}, [props.refresh]);

	return (
		<select className="contentsSelect" onChange={props.onChange.bind(this)}>
			{files.map((item: gpxFile) => (
				<option key={item.name}>{item.name}</option>
			))}
		</select>
	);
};

export default ViewMapsDataGpxFileSelect;
