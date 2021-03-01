// npm install --save-dev react @types/react
import React from "react";

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
	/**
	 * React：useEffect：props.refresh
	 */
	React.useEffect(() => {
		if (props.refresh) {
			console.log("Refresh");
		}
	}, [props.refresh]);

	return (
		<select className="contentsSelect" onChange={props.onChange.bind(this)}>
			<option>未選択</option>
			<option>20190519.gpx</option>
			<option>20190428.gpx</option>
			<option>20180811.gpx</option>
		</select>
	);
};

export default ViewMapsDataGpxFileSelect;
