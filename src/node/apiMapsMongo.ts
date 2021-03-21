import express from "express";
import { apiMapsMongoPointInPolygon } from "../api/mapsMongo";
import { mapsMongo, mapsMongoPointInPolygonData, mapsMongoPointInPolygonErrorMessage } from "../ts/mapsMongo";
import { Collection, MongoClient } from "mongodb";

import { log } from "../ts/log";
const syslog: log = new log("maps.mongo");

interface mongoCollectionPrefcapital {
	pref: string;
	addr: string;
	loc: number[];
	distance: string;
}

interface apiResponsePrefcapitalNear {
	pref: string;
	addr: string;
	lat: number;
	lon: number;
	distance: string;
}

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
		super(host, port);

		this.uri = uri;
		this.host = host;
		this.port = port;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		// 指定した緯度経度に近い都道府県庁の緯度経度と距離（m）を取得
		router.get(this.uri + "/mongo/prefcapital/near", (req: express.Request, res: express.Response) => {
			if (req.query.lat && req.query.lon && req.query.n) {
				const lat: number = +req.query.lat;
				const lon: number = +req.query.lon;
				const n: number = +req.query.n;
				if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(n)) {
					void this.prefcapitalNear(lat, lon, n, res);
					return;
				}
			}

			res.json({});
			res.end();
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
					"PostOffice",
					d_gtype,
					d_gcoordinates,
					d_n,
					(r: mapsMongoPointInPolygonData[]) => {
						res.send(r);
						res.end();
					},
					(e: mapsMongoPointInPolygonErrorMessage) => {
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
					"RoadsiteStation",
					d_gtype,
					d_gcoordinates,
					d_n,
					(r: mapsMongoPointInPolygonData[]) => {
						res.send(r);
						res.end();
					},
					(e: mapsMongoPointInPolygonErrorMessage) => {
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

	/**
	 * 指定した緯度経度に近い都道府県庁の緯度経度と距離（m）を取得
	 * @param lat 緯度
	 * @param lon 経度
	 * @param n 取得件数0 = 全件, 1 <= n <= 100
	 * @param res レスポンス
	 */
	public async prefcapitalNear(lat: number, lon: number, n: number, res: express.Response): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectPrefCapital();
		if (!collection) {
			return;
		}

		let client: MongoClient | null = this.client;
		try {
			await collection
				.aggregate([
					{
						$geoNear: {
							near: {
								type: "Point",
								coordinates: [lon, lat],
							},
							distanceField: "distance",
							spherical: true,
						},
					},
					{
						$limit: this.paramN(n, 100),
					},
				])
				.toArray()
				.then((data: mongoCollectionPrefcapital[]) => {
					const r: apiResponsePrefcapitalNear[] = data.map(
						(v: mongoCollectionPrefcapital): apiResponsePrefcapitalNear => {
							return {
								// 都道府県名
								pref: v.pref,
								// 住所
								addr: v.addr,
								// 緯度
								lat: v.loc[1],
								// 経度
								lon: v.loc[0],
								// m
								distance: v.distance,
							};
						}
					);
					res.json(r);
					res.end();

					if (client) {
						void client.close();
						client = null;
					}
				});
		} catch (e) {
			syslog.error(e);
			res.status(400).send({ message: "param error" });
			res.end();
		} finally {
			if (client) {
				void client.close();
			}
		}
	}
}
