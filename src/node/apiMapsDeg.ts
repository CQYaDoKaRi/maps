import express from "express";
import { mapsApiDeg2Name } from "../api/maps";
export class apiMapsDeg {
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
		router.get(this.uri + "/deg2name", (req: express.Request, res: express.Response) => {
			res.json(mapsApiDeg2Name(req.query.deg ? +req.query.deg : undefined));
			res.end();
		});
	}
}
