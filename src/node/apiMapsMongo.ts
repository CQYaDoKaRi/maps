import express from "express";
import { mapsMongo, mapsMongoNearData, mapsMongoPointInPolygonData, mapsMongoErrorMessage } from "../ts/mapsMongo";
import { syslogDir } from "./config";
import { apiMapsMongoNear, apiMapsMongoPointInPolygon } from "../api/mapsMongo";
import { apiMapsMongoCreate } from "../api/mapsMongoCreate";
export class apiMapsMongo extends mapsMongo {
	private uri = "";
	private host = "";
	private port = 0;

	/**
	 * コンストラクター
	 * @param uri API URI
	 * @param host ホスト名
	 * @param port ポート番号
	 */
	constructor(uri: string, host: string, port: number) {
		super(host, port, syslogDir);

		this.uri = uri;
		this.host = host;
		this.port = port;

		// Create
		const oMongoCreate: apiMapsMongoCreate = new apiMapsMongoCreate(host, port, syslogDir);
		void oMongoCreate.collections();
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		// 指定した緯度経度に近い都道府県庁の緯度経度と距離（m）を取得
		router.get(this.uri + "/mongo/prefcapital/near", (req: express.Request, res: express.Response) => {
			if (
				!apiMapsMongoNear(
					this.host,
					this.port,
					syslogDir,
					req.query.lat ? +req.query.lat : 0,
					req.query.lon ? +req.query.lon : 0,
					req.query.n ? +req.query.n : 0,
					(r: mapsMongoNearData[]) => {
						res.send(r);
						res.end();
					},
					(e: mapsMongoErrorMessage) => {
						res.status(400).send(e);
						res.end();
					}
				)
			) {
				res.json({});
				res.end();
			}
		});

		// 指定したポリゴンに含まれる郵便局を取得
		router.post(this.uri + "/mongo/postoffice/inpolygon", (req: express.Request, res: express.Response) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gtype: string = req.query.gtype ? req.query.gtype : req.body.gtype;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gcoordinates: string = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_n: number = req.query.n ? +req.query.n : +req.body.n;

			if (
				!apiMapsMongoPointInPolygon(
					this.host,
					this.port,
					syslogDir,
					"PostOffice",
					d_gtype,
					d_gcoordinates,
					d_n,
					(r: mapsMongoPointInPolygonData[]) => {
						res.send(r);
						res.end();
					},
					(e: mapsMongoErrorMessage) => {
						res.status(400).send(e);
						res.end();
					}
				)
			) {
				res.json({});
				res.end();
			}
		});

		// 指定したポリゴンに含まれる道の駅を取得
		router.post(this.uri + "/mongo/roadsitestation/inpolygon", (req: express.Request, res: express.Response) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gtype: string = req.query.gtype ? req.query.gtype : req.body.gtype;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gcoordinates: string = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_n: number = req.query.n ? +req.query.n : +req.body.n;

			if (
				!apiMapsMongoPointInPolygon(
					this.host,
					this.port,
					syslogDir,
					"RoadsiteStation",
					d_gtype,
					d_gcoordinates,
					d_n,
					(r: mapsMongoPointInPolygonData[]) => {
						res.send(r);
						res.end();
					},
					(e: mapsMongoErrorMessage) => {
						res.status(400).send(e);
						res.end();
					}
				)
			) {
				res.json({});
				res.end();
			}
		});
	}
}
