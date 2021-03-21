import {
	mapsMongo,
	mapsMongoSyslog,
	mapsMongoPointInPolygonSuccess,
	mapsMongoPointInPolygonError,
} from "../ts/mapsMongo";

/**
 * GPX ファイルリストを取得
 * @param dir data フォルダー
 * @returns JSON
 */
export const apiMapsMongoPrefcapitalNear = (
	lat: number | undefined,
	lon: number | undefined,
	n: number | undefined
): void => {
	if (lat && lon && n) {
		lat = +lat;
		lon = +lon;
		n = +n;
		if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(n)) {
			//void this.prefcapitalNear(lat, lon, n, res);
		}
	}
};

/**
 * 指定したポリゴンに含まれるポイントを取得
 * @param host ホスト名
 * @param port ポート番号
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
	type: string,
	gtype: string,
	gcoordinates: string,
	n: number,
	resSucces: mapsMongoPointInPolygonSuccess,
	resError: mapsMongoPointInPolygonError
): boolean => {
	const oMapsMongo = new mapsMongo(host, port);

	if (gcoordinates && n) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const coordinates: [] = JSON.parse(gcoordinates);
			if (coordinates.length > 0 && !Number.isNaN(n)) {
				void oMapsMongo.pointInPolygon(type, gtype, coordinates, n, resSucces, resError);
				return true;
			}
		} catch (e) {
			mapsMongoSyslog.error(e);
		}
	}
	return false;
};
