import express from "express";
import { mapsApiTky2jgdG, mapsApiJgd2tky2G } from "../api/maps";
export class apiMapsLatLon {
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
		router.get(this.uri + "/tky2jgdg", (req: express.Request, res: express.Response) => {
			res.json(mapsApiTky2jgdG(req.query.lat ? +req.query.lat : undefined, req.query.lon ? +req.query.lon : undefined));
			res.end();
		});

		router.get(this.uri + "/jgd2tkyg", (req: express.Request, res: express.Response) => {
			res.json(
				mapsApiJgd2tky2G(req.query.lat ? +req.query.lat : undefined, req.query.lon ? +req.query.lon : undefined)
			);
			res.end();
		});
	}
}
