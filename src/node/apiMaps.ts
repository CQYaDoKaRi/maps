import express from "express";
import {
	mapsApiDeg2Name,
	mapsApiTky2jgdG,
	mapsApiJgd2tky2G,
	mapsApiDistance,
	mapsApiDistanceTo,
	mapsApiDirection,
	mapsApiTile,
	mapsApiTile2latlon,
	mapsApiTileScale,
	mapsApiTile2z,
	mapApiTileDemUrl,
} from "../api/maps";
export class apiMaps {
	private uri = "";

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string) {
		this.uri = uri;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		// 方位角を12方位名に変換
		router.get(this.uri + "/deg2name", (req: express.Request, res: express.Response) => {
			res.json(mapsApiDeg2Name(req.query.deg ? +req.query.deg : undefined));
			res.end();
		});

		// 日本測地系を世界測地系に変換（1次式）
		router.get(this.uri + "/tky2jgdg", (req: express.Request, res: express.Response) => {
			res.json(mapsApiTky2jgdG(req.query.lat ? +req.query.lat : undefined, req.query.lon ? +req.query.lon : undefined));
			res.end();
		});

		// 世界測地系を日本測地系に変換（1次式）
		router.get(this.uri + "/jgd2tkyg", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiJgd2tky2G(req.query.lat ? +req.query.lat : undefined, req.query.lon ? +req.query.lon : undefined)
			);
			res.end();
		});

		// ２地点間の距離：球面三角法
		router.get(this.uri + "/distancet", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiDistance(
					"T",
					req.query.lat1 ? +req.query.lat1 : undefined,
					req.query.lon1 ? +req.query.lon1 : undefined,
					req.query.lat2 ? +req.query.lat2 : undefined,
					req.query.lon2 ? +req.query.lon2 : undefined
				)
			);
			res.end();
		});

		// ２地点間の距離：ヒュベニ
		router.get(this.uri + "/distanceh", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiDistance(
					"H",
					req.query.lat1 ? +req.query.lat1 : undefined,
					req.query.lon1 ? +req.query.lon1 : undefined,
					req.query.lat2 ? +req.query.lat2 : undefined,
					req.query.lon2 ? +req.query.lon2 : undefined
				)
			);
			res.end();
		});

		// ２地点間の距離：測地線航海算法
		router.get(this.uri + "/distances", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiDistance(
					"S",
					req.query.lat1 ? +req.query.lat1 : undefined,
					req.query.lon1 ? +req.query.lon1 : undefined,
					req.query.lat2 ? +req.query.lat2 : undefined,
					req.query.lon2 ? +req.query.lon2 : undefined
				)
			);
			res.end();
		});

		// 角度・距離から緯度経度を取得
		router.get(this.uri + "/distanceto", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiDistanceTo(
					req.query.lat ? +req.query.lat : undefined,
					req.query.lon ? +req.query.lon : undefined,
					req.query.a ? +req.query.a : undefined,
					req.query.len ? +req.query.len : undefined
				)
			);
			res.end();
		});

		// ２地点間の角度
		router.get(this.uri + "/direction", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiDirection(
					req.query.lat1 ? +req.query.lat1 : undefined,
					req.query.lon1 ? +req.query.lon1 : undefined,
					req.query.lat2 ? +req.query.lat2 : undefined,
					req.query.lon2 ? +req.query.lon2 : undefined
				)
			);
			res.end();
		});

		// 緯度経度・ズームレベルからタイル座標を取得
		router.get(this.uri + "/tile", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiTile(
					req.query.lat ? +req.query.lat : undefined,
					req.query.lon ? +req.query.lon : undefined,
					req.query.z ? +req.query.z : undefined
				)
			);
			res.end();
		});

		// タイル座標から緯度経度を取得
		router.get(this.uri + "/tile2latlon", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiTile2latlon(
					req.query.x ? +req.query.x : undefined,
					req.query.y ? +req.query.y : undefined,
					req.query.z ? +req.query.z : undefined
				)
			);
			res.end();
		});

		// タイル座標のズームレベルから縮尺を取得
		router.get(this.uri + "/tilescale", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiTileScale(
					req.query.lat ? +req.query.lat : undefined,
					req.query.z ? +req.query.z : undefined,
					req.query.dpi ? +req.query.dpi : undefined
				)
			);
			res.end();
		});

		// タイル座標のズームレベルを変更した場合のタイル座標を取得
		router.get(this.uri + "/tile2z", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiTile2z(
					req.query.x ? +req.query.x : undefined,
					req.query.y ? +req.query.y : undefined,
					req.query.z ? +req.query.z : undefined,
					req.query.toz ? +req.query.toz : undefined
				)
			);
			res.end();
		});

		// 標高タイルURLを取得[png]
		router.get(this.uri + "/tiledemurl/png", (req: express.Request, res: express.Response) => {
			res.json(
				mapApiTileDemUrl(
					"png",
					req.query.x ? +req.query.x : undefined,
					req.query.y ? +req.query.y : undefined,
					req.query.z ? +req.query.z : undefined
				)
			);
			res.end();
		});

		// 標高タイルURLを取得[txt]
		router.get(this.uri + "/tiledemurl/txt", (req: express.Request, res: express.Response) => {
			res.json(
				mapApiTileDemUrl(
					"txt",
					req.query.x ? +req.query.x : undefined,
					req.query.y ? +req.query.y : undefined,
					req.query.z ? +req.query.z : undefined
				)
			);
			res.end();
		});
	}
}
