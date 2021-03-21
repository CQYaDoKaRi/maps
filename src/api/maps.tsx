import { maps, mapsLatLon } from "../ts/maps";

export type mapsApiDeg2NameData = {
	status: boolean;
	name: string;
};

type mapsApiDistanceData = {
	status: boolean;
	distance: number;
};

type mapsApiDirectionData = {
	status: boolean;
	a: number;
};

type mapsApiDistanceToData = {
	status: boolean;
	lat: number;
	lon: number;
};

/**
 * 方位角を12方位名に変換
 * @param deg 方位の角度
 * @returns mapsApiDeg2NameData
 */
export const mapsApiDeg2Name = (deg: number | undefined): mapsApiDeg2NameData => {
	const ret: mapsApiDeg2NameData = {
		status: false,
		name: "",
	};

	const oMaps: maps = new maps();

	if (deg) {
		deg = +deg;
		if (!Number.isNaN(deg)) {
			ret.status = true;
			ret.name = oMaps.deg2Name(deg);
		}
	}

	return ret;
};

/**
 * ２地点間の距離
 * @param type type T:球面三角法,H:ヒュベニ,S:測地線航海算法
 * @param lat1 十進緯度（世界測地系[GSR80]）
 * @param lon1 十進経度（世界測地系[GSR80]）
 * @param lat2 十進緯度（世界測地系[GSR80]）
 * @param lon2 十進経度（世界測地系[GSR80]）
 * @returns JSON
 */
export const mapsApiDistance = (
	type: string,
	lat1: number | undefined,
	lon1: number | undefined,
	lat2: number | undefined,
	lon2: number | undefined
): mapsApiDistanceData => {
	const data: mapsApiDistanceData = {
		status: false,
		distance: 0,
	};

	const oMaps: maps = new maps();

	if (type === "T" || type === "H" || type === "S") {
		if (lat1 && lon1 && lat2 && lon2) {
			lat1 = +lat1;
			lon1 = +lon1;
			lat2 = +lat2;
			lon2 = +lon2;
			if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
				if (type === "T") {
					const distance: number = oMaps.distanceT(lat1, lon1, lat2, lon2);
					data.status = true;
					data.distance = distance;
				} else if (type === "H") {
					const distance: number = oMaps.distanceH(lat1, lon1, lat2, lon2);
					data.status = true;
					data.distance = distance;
				} else if (type === "S") {
					const distance: number = oMaps.distanceS(lat1, lon1, lat2, lon2);
					data.status = true;
					data.distance = distance;
				}
			}
		}
	}

	return data;
};

/**
 * 角度・距離から緯度経度を取得
 * @param lat 十進緯度（世界測地系[GSR80]）
 * @param lon 十進経度（世界測地系[GSR80]）
 * @param a 角度
 * @param len 距離(m)
 * @returns JSON
 */
export const mapsApiDistanceTo = (
	lat: number | undefined,
	lon: number | undefined,
	a: number | undefined,
	len: number | undefined
): mapsApiDistanceToData => {
	const data: mapsApiDistanceToData = {
		status: false,
		lat: 0,
		lon: 0,
	};

	const oMaps: maps = new maps();

	if (lat && lon && a && len) {
		lat = +lat;
		lon = +lon;
		a = +a;
		len = +len;
		if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(a) && !Number.isNaN(len)) {
			const pos: mapsLatLon = oMaps.distanceTo(lat, lon, a, len);
			data.status = true;
			data.lat = pos.lat;
			data.lon = pos.lon;
		}
	}

	return data;
};

/**
 * ２地点間の角度
 * @param lat1 十進緯度（世界測地系[GSR80]）
 * @param lon1 十進経度（世界測地系[GSR80]）
 * @param lat2 十進緯度（世界測地系[GSR80]）
 * @param lon2 十進経度（世界測地系[GSR80]）
 * @returns JSON
 */
export const mapsApiDirection = (
	lat1: number | undefined,
	lon1: number | undefined,
	lat2: number | undefined,
	lon2: number | undefined
): mapsApiDirectionData => {
	const data: mapsApiDirectionData = {
		status: false,
		a: 0,
	};

	const oMaps: maps = new maps();

	if (lat1 && lon1 && lat2 && lon2) {
		lat1 = +lat1;
		lon1 = +lon1;
		lat2 = +lat2;
		lon2 = +lon2;
		if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
			const a: number = oMaps.direction(lat1, lon1, lat2, lon2);
			data.status = true;
			data.a = a;
		}
	}

	return data;
};
