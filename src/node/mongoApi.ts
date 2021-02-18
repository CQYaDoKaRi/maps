import express from "express";
import { mongo } from "./mongo";
import { Collection, MongoClient } from "mongodb";

import { log } from "./log";
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

interface apiResponsePointInPolygon {
	name: string;
	lat: number;
	lon: number;
}

export class mongoApi extends mongo {
	/**
	 * コンストラクター
	 * @param uri API URI
	 * @param host ホスト名
	 * @param port ポート番号
	 */
	constructor(uri: string, host: string, port: number) {
		super(uri, host, port);
	}

	/**
	 * パラメーター引数：取得件数
	 * @param n 取得件数：0 = 全件, 1 <= n <= max
	 * @param max 最大件数
	 * @returns 取得件数：0 = 全件, 1 <= n <= max
	 */
	private paramN(n: number, max: number): number {
		if (n === 0) {
			return max;
		} else if (n < 1) {
			return 1;
		} else if (n > max) {
			return max;
		}
		return n;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
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

		router.post(this.uri + "/mongo/postoffice/inpolygon", (req: express.Request, res: express.Response) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gtype: string = req.query.gtype ? req.query.gtype : req.body.gtype;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gcoordinates: string = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_n: string = req.query.n ? req.query.n : req.body.n;
			if (d_gcoordinates && d_n) {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const coordinates: [] = JSON.parse(d_gcoordinates);
					const n: number = +d_n;
					if (coordinates.length > 0 && !Number.isNaN(n)) {
						void this.pointInPolygon("PostOffice", d_gtype, coordinates, n, res);
						return;
					}
				} catch (e) {
					syslog.error(e);
				}
			}

			res.json({});
			res.end();
		});

		router.post(this.uri + "/mongo/roadsitestation/inpolygon", (req: express.Request, res: express.Response) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gtype: string = req.query.gtype ? req.query.gtype : req.body.gtype;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_gcoordinates: string = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const d_n: string = req.query.n ? req.query.n : req.body.n;
			if (d_gcoordinates && d_n) {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const coordinates: [] = JSON.parse(d_gcoordinates);
					const n: number = +d_n;
					if (coordinates.length > 0 && !Number.isNaN(n)) {
						void this.pointInPolygon("RoadsiteStation", d_gtype, coordinates, n, res);
						return;
					}
				} catch (e) {
					syslog.error(e);
				}
			}

			res.json({});
			res.end();
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

	/**
	 * ポリゴンに含まれるポイントを取得
	 * @param type 検索対象[PostOffice, RoadsiteStation]
	 * @param gtype タイプ[Polygon, MultiPolygon]
	 * @param gcoordinates ポリゴン座標
	 * @param n 取得件数0 = 全件, 1 <= n <= 10000
	 * @param res レスポンス
	 */
	public async pointInPolygon(
		type: string,
		gtype: string,
		gcoordinates: [],
		n: number,
		res: express.Response
	): Promise<void> {
		// 接続
		let collection: Collection | null = null;
		if (type == "PostOffice") {
			collection = await this.connectPostOffice();
		} else if (type == "RoadsiteStation") {
			collection = await this.connectRoadsiteStation();
		}

		if (!collection) {
			return;
		}

		if (!(gtype === "Polygon" || gtype === "MultiPolygon")) {
			gtype = "Polygon";
		}

		let client: MongoClient | null = this.client;
		try {
			await collection
				.aggregate([
					{
						$match: {
							"loc.coordinates": {
								$geoWithin: {
									$geometry: {
										type: gtype,
										coordinates: gcoordinates,
									},
								},
							},
						},
					},
					{
						$limit: this.paramN(n, 10000),
					},
				])
				.toArray()
				.then(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(data: any[]) => {
						const r: apiResponsePointInPolygon[] = data.map(
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							(v: any) => {
								if (type == "PostOffice") {
									return {
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										name: v.properties.P30_005,
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										lat: v.loc.coordinates[1],
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										lon: v.loc.coordinates[0],
									};
								} else if (type == "RoadsiteStation") {
									return {
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										name: v.properties.P35_006,
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										lat: v.loc.coordinates[1],
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										lon: v.loc.coordinates[0],
									};
								} else {
									return {
										name: "",
										lat: 0,
										lon: 0,
									};
								}
							}
						);
						res.json(r);
						res.end();

						if (client) {
							void client.close();
							client = null;
						}
					}
				);
		} catch (e) {
			syslog.error(e);
			res.status(400).send({ message: "param[coordinates] error" });
			res.end();
		} finally {
			if (client) {
				void client.close();
			}
		}
	}
}
