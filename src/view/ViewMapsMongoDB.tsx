// npm install --save-dev react @types/react
import React, { useRef, useEffect } from "react";

import { appMaps } from "../ts/appMaps";

/**
 * React Component - ViewMapsMongoDB - props
 */
type Props = {
	mapLat: number;
	mapLon: number;
	mapZ: number;
};

/**
 * React Component - ViewMapsMongoDB
 * @param props props
 */
const ViewMapsMongoDB: React.FC<Props> = (props) => {
	// オブジェクト
	const oMap = useRef(null);

	useEffect(() => {
		const _MapOptions = {
			w: 100,
			wUnit: "%",
			h: 600,
			hUnit: "px",
		};

		// 地図：初期化
		const oDiv = (oMap.current as unknown) as HTMLElement;
		const oAppMaps = new appMaps(oDiv.id, props.mapLat, props.mapLon, props.mapZ, _MapOptions);
		oAppMaps.layerPref();
	}, []);

	return (
		<div className="contentsMongoDB">
			<div ref={oMap} id="appMongoDBMap"></div>
		</div>
	);
};

export default ViewMapsMongoDB;
