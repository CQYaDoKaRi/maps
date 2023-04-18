import { maps, mapsLatLon, mapsTileUrl, mapsTile } from "../ts/maps";

export type apiMapsDeg2NameData = {
	status: boolean;
	name: string;
};

export type apiMapsLatLonData = {
	status: boolean;
	lat: number;
	lon: number;
};

export type apiMapsDistanceData = {
	status: boolean;
	distance: number;
};

export type apiMapsDirectionData = {
	status: boolean;
	a: number;
};

export type apiMapsDistanceToData = {
	status: boolean;
	lat: number;
	lon: number;
};

export type apiMapsTileData = {
	status: boolean;
	x: number;
	y: number;
	z: number;
	px_x: number;
	px_y: number;
};

export type apiMapsTileUrlData = {
	status: boolean;
	x: number;
	y: number;
	z: number;
};

export type apiMapsTileUrlInfoData = {
	x: number;
	y: number;
	z: number;
	ext: string;
	url: string;
};

export type apiMapsTileUrlsData = {
	status: boolean;
	urls: apiMapsTileUrlInfoData[];
};

export type apiMapsTileScale = {
	status: boolean;
	scale: number;
};

/**
 * 方位角を12方位名に変換
 * @param deg 方位の角度
 * @returns apiMapsDeg2NameData
 */
export const apiMapsDeg2Name = (deg: number | undefined): apiMapsDeg2NameData => {
	const ret: apiMapsDeg2NameData = {
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
 * 日本測地系を世界測地系に変換（1次式）
 * @param lat 十進緯度（世界測地系[GSR80]）
 * @param lon 十進経度（世界測地系[GSR80]）
 * @returns JSON
 */
export const apiMapsTky2jgdG = (lat: number | undefined, lon: number | undefined): apiMapsLatLonData => {
	const data: apiMapsLatLonData = {
		status: false,
		lat: 0,
		lon: 0,
	};

	const oMaps: maps = new maps();

	if (lat && lon) {
		lat = +lat;
		lon = +lon;
		if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
			const pos: mapsLatLon = oMaps.tky2jgdG(lat, lon);
			data.status = true;
			data.lat = pos.lat;
			data.lon = pos.lon;
		}
	}

	return data;
};

/**
 * 世界測地系を日本測地系に変換（1次式）
 * @param lat 十進緯度（世界測地系[GSR80]）
 * @param lon 十進経度（世界測地系[GSR80]）
 * @returns JSON
 */
export const apiMapsJgd2tky2G = (lat: number | undefined, lon: number | undefined): apiMapsLatLonData => {
	const data: apiMapsLatLonData = {
		status: false,
		lat: 0,
		lon: 0,
	};

	const oMaps: maps = new maps();

	if (lat && lon) {
		lat = +lat;
		lon = +lon;
		if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
			const pos: mapsLatLon = oMaps.jgd2tkyG(lat, lon);
			data.status = true;
			data.lat = pos.lat;
			data.lon = pos.lon;
		}
	}

	return data;
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
export const apiMapsDistance = (
	type: string,
	lat1: number | undefined,
	lon1: number | undefined,
	lat2: number | undefined,
	lon2: number | undefined
): apiMapsDistanceData => {
	const data: apiMapsDistanceData = {
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
export const apiMapsDistanceTo = (
	lat: number | undefined,
	lon: number | undefined,
	a: number | undefined,
	len: number | undefined
): apiMapsDistanceToData => {
	const data: apiMapsDistanceToData = {
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
export const apiMapsDirection = (
	lat1: number | undefined,
	lon1: number | undefined,
	lat2: number | undefined,
	lon2: number | undefined
): apiMapsDirectionData => {
	const data: apiMapsDirectionData = {
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

/**
 * 緯度経度・ズームレベルからタイル座標を取得
 * @param lat 十進緯度（世界測地系[GSR80]）
 * @param lon 十進経度（世界測地系[GSR80]）
 * @param z ズームレベル
 * @returns JSON
 */
export const apiMapsTile = (
	lat: number | undefined,
	lon: number | undefined,
	z: number | undefined
): apiMapsTileData => {
	const data: apiMapsTileData = {
		status: false,
		x: 0,
		y: 0,
		z: 0,
		px_x: 0,
		px_y: 0,
	};

	const oMaps: maps = new maps();

	if (lat && lon && z) {
		lat = +lat;
		lon = +lon;
		z = +z;
		if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(z)) {
			const tile: mapsTile = oMaps.tile(lat, lon, z);
			data.status = true;
			data.x = tile.x;
			data.y = tile.y;
			data.z = tile.z;
			data.px_x = tile.px_x;
			data.px_y = tile.px_y;
		}
	}

	return data;
};

/**
 * タイル座標から緯度経度を取得
 * @param x タイル座標X
 * @param y タイル座標Y
 * @param z ズームレベル
 * @returns JSON
 */
export const apiMapsTile2latlon = (
	x: number | undefined,
	y: number | undefined,
	z: number | undefined
): apiMapsLatLonData => {
	const data: apiMapsLatLonData = {
		status: false,
		lat: 0,
		lon: 0,
	};

	const oMaps: maps = new maps();

	if (x && y && z) {
		x = +x;
		y = +y;
		z = +z;
		if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
			const pos: mapsLatLon = oMaps.tile2LatLon(x, y, z);
			data.status = true;
			data.lat = pos.lat;
			data.lon = pos.lon;
		}
	}

	return data;
};

/**
 * タイル座標のズームレベルから縮尺を取得
 * @param lat 十進緯度（世界測地系[GSR80]）
 * @param z ズームレベル
 * @param dpi 解像度
 * @returns JSON
 */
export const apiMapsTileScale = (
	lat: number | undefined,
	z: number | undefined,
	dpi: number | undefined
): apiMapsTileScale => {
	const data: apiMapsTileScale = {
		status: false,
		scale: 0,
	};

	const oMaps: maps = new maps();

	if (lat && z && dpi) {
		lat = +lat;
		z = +z;
		dpi = +dpi;
		if (!Number.isNaN(lat) && !Number.isNaN(z) && !Number.isNaN(dpi)) {
			const scale: number = oMaps.tileScale(z, lat, dpi);
			data.status = true;
			data.scale = scale;
		}
	}

	return data;
};

/**
 * タイル座標のズームレベルを変更した場合のタイル座標を取得
 * @param x タイル座標X
 * @param y タイル座標Y
 * @param z ズームレベル
 * @param toz 変更するズームレベル
 * @returns JSON
 */
export const apiMapsTile2z = (
	x: number | undefined,
	y: number | undefined,
	z: number | undefined,
	toz: number | undefined
): apiMapsTileUrlData => {
	const data: apiMapsTileUrlData = {
		status: false,
		x: 0,
		y: 0,
		z: 0,
	};

	const oMaps: maps = new maps();

	if (x && y && z && toz) {
		x = +x;
		y = +y;
		z = +z;
		toz = +toz;
		if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z) && !Number.isNaN(toz)) {
			const tile: mapsTile = oMaps.tile2z(x, y, z, toz);
			data.status = true;
			data.x = tile.x;
			data.y = tile.y;
			data.z = tile.z;
		}
	}

	return data;
};

/**
 * 標高タイルURLを取得
 * @param type type png,txt
 * @param x タイル座標X
 * @param y タイル座標Y
 * @param z ズームレベル
 * @returns JSON
 */
export const apiMapsTileDemUrl = (
	type: string,
	x: number | undefined,
	y: number | undefined,
	z: number | undefined
): apiMapsTileUrlsData => {
	const data: apiMapsTileUrlsData = {
		status: false,
		urls: [],
	};

	const oMaps: maps = new maps();

	if (x && y && z) {
		x = +x;
		y = +y;
		z = +z;
		if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
			let tileUrls: mapsTileUrl[] = [];
			if (type === "png") {
				tileUrls = oMaps.tileDemUrlPng(x, y, z);
			} else {
				tileUrls = oMaps.tileDemUrlTxt(x, y, z);
			}

			tileUrls.map((tileUrl: mapsTileUrl) => {
				if (tileUrl.tile) {
					data.status = true;
					data.urls.push({
						x: tileUrl.tile.x,
						y: tileUrl.tile.y,
						z: tileUrl.tile.z,
						ext: tileUrl.ext,
						url: tileUrl.url,
					});
				}
			});
		}
	}

	return data;
};
