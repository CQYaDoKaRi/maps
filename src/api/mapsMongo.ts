import {
	mapsMongo,
	mapsMongoError,
	mapsMongoNearSuccess,
	mapsMongoPointInPolygonSuccess,
} from "../ts/mapsMongo";

/**
 * 指定した緯度経度に近いポイントの緯度経度と距離（m）を取得
 * @param host ホスト名
 * @param port ポート番号
 * @param dirLogs ログフォルダー
 * @param lat 緯度
 * @param lon 経度
 * @param n 取得件数(0, 1 ～ 10000)、0 を指定した場合、最大件数（10000件）
 * @param resSucces レスポンス（成功）
 * @param resError レスポンス（失敗）
 * @returns ステータス
 */
export const apiMapsMongoNear = (
	host: string,
	port: number,
	dirLogs: string,
	lat: number | undefined,
	lon: number | undefined,
	n: number | undefined,
	resSucces: mapsMongoNearSuccess,
	resError: mapsMongoError
): boolean => {
	const oMapsMongo = new mapsMongo(host, port, dirLogs);

	if (lat && lon && n) {
		lat = +lat;
		lon = +lon;
		n = +n;
		if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(n)) {
			try {
				void oMapsMongo.near(lat, lon, n, resSucces, resError);
				return true;
			} catch (e) {
				oMapsMongo.logError(e);
			}
		}
	}
	return false;
};

/**
 * 指定したポリゴンに含まれるポイントを取得
 * @param host ホスト名
 * @param port ポート番号
 * @param dirLogs ログフォルダー
 * @param type PostOffice:郵便局, RoadsiteStation:道の駅
 * @param gtype GeoJSON - Polygon Type[Polygon, MultiPolygon]
 * @param gcoordinates GeoJSON - Polygon 座標（世界測地系[GSR80]）
 * @param n 取得件数(0, 1 ～ 10000)、0 を指定した場合、最大件数（10000件）
 * @param resSucces レスポンス（成功）
 * @param resError レスポンス（失敗）
 * @returns ステータス
 */
export const apiMapsMongoPointInPolygon = (
	host: string,
	port: number,
	dirLogs: string,
	type: string,
	gtype: string,
	gcoordinates: string,
	n: number,
	resSucces: mapsMongoPointInPolygonSuccess,
	resError: mapsMongoError
): boolean => {
	const oMapsMongo = new mapsMongo(host, port, dirLogs);

	if (gcoordinates && n) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const coordinates: [] = JSON.parse(gcoordinates);
			if (coordinates.length > 0 && !Number.isNaN(n)) {
				void oMapsMongo.pointInPolygon(type, gtype, coordinates, n, resSucces, resError);
				return true;
			}
		} catch (e) {
			oMapsMongo.logError(e);
		}
	}
	return false;
};
