import express from "express";
import { mapsApiDistance, mapsApiDistanceTo, mapsApiDirection } from "../api/maps";
export class apiMapsDistance {
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
	}
}
