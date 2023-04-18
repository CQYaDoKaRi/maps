import express from "express";
import path from "path";
import { apiViewGpxFiles } from "../api/view";
export class apiView {
	private uri = "";

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string) {
		this.uri = `${uri}/view`;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		// GPX ファイルリストを取得
		router.get(this.uri + "/gpx/files", (req: express.Request, res: express.Response) => {
			res.json(apiViewGpxFiles(path.join(__dirname, "./../../public/data")));
			res.end();
		});
	}
}
