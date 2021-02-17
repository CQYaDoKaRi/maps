import express from 'express';
import { Collection, MongoClient } from 'mongodb'
import { mongo } from './mongo';

import { log } from './log';
const syslog: log = new log('maps.mongo');

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
		}
		else if (n < 1 ) {
			return 1;
		}
		else if (n > max) {
			return max;
		}
		return n;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public async regist(router: express.Router): Promise<void> {

		router.get(this.uri + '/mongo/prefcapital/near',
			(req: express.Request, res: express.Response) => {
				if (req.query.lat && req.query.lon && req.query.n) {
					const lat: number = +req.query.lat;
					const lon: number = +req.query.lon;
					const n: number = +req.query.n;
					if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(n)) {
						this.prefcapitalNear(lat, lon, n, res);
						return;
					}
				}

				res.json({});
				res.end();
			}
		);

		router.post(this.uri + '/mongo/postoffice/inpolygon',
			(req: express.Request, res: express.Response) => {
				const d_gtype = req.query.gtype ? req.query.gtype : req.body.gtype;
				const d_gcoordinates = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
				const d_n = req.query.n ? req.query.n : req.body.n;
				if (d_gcoordinates && d_n) {
					try {
						const coordinates: [] =  JSON.parse('' + d_gcoordinates);
						const n: number = +d_n;
						if (coordinates.length > 0 && !Number.isNaN(n)) {
							this.pointInPolygon('PostOffice', d_gtype, coordinates, n, res);
							return;
						}
					}
					catch(e){
						syslog.error(e);
					}
				}

				res.json({});
				res.end();
			}
		);

		router.post(this.uri + '/mongo/roadsitestation/inpolygon',
			(req: express.Request, res: express.Response) => {
				const d_gtype = req.query.gtype ? req.query.gtype : req.body.gtype;
				const d_gcoordinates = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
				const d_n = req.query.n ? req.query.n : req.body.n;
				if (d_gcoordinates && d_n) {
					try {
						const coordinates: [] =  JSON.parse('' + d_gcoordinates);
						const n: number = +d_n;
						if (coordinates.length > 0 && !Number.isNaN(n)) {
							this.pointInPolygon('RoadsiteStation', d_gtype, coordinates, n, res);
							return;
						}
					}
					catch(e){
						syslog.error(e);
					}
				}

				res.json({});
				res.end();
			}
		);
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
			await collection.aggregate(
				[
					{
						$geoNear: {
							near: {
								type: 'Point'
								, coordinates: [ lon, lat ]
							}
							, distanceField: 'distance'
							, spherical: true
						}
					}
					, {
						$limit: this.paramN(n, 100)
					}
				],
			)
			.toArray()
				.then(
					(data: any[]) => {
						data = data.map(
							(v) => {
								return {
									// 都道府県名
									'pref': v.pref
									// 住所
									, 'addr': v.addr
									// 緯度
									, 'lat': v.loc[1]
									// 経度
									, 'lon': v.loc[0]
									// m
									, 'distance': v.distance
								};
							}
						);
						res.json(data);
						res.end();

						if (client) {
							client.close();
							client = null;
						}
					}
				);
		}
		catch(e){
			syslog.error(e);
			res.status(400).send({ message : 'param error' });
			res.end();
		}
		finally {
			if (client) {
				client.close();
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
	public async pointInPolygon(type: string, gtype: string, gcoordinates: [], n: number, res: express.Response): Promise<void> {
		// 接続
		let collection: Collection | null = null;
		if (type == 'PostOffice') {
			collection = await this.connectPostOffice();
		}
		else if (type == 'RoadsiteStation') {
			collection = await this.connectRoadsiteStation();
		}

		if (!collection) {
			return;
		}

		if(!(gtype === 'Polygon' || gtype === 'MultiPolygon')){
			gtype = 'Polygon';
		}

		let client: MongoClient | null = this.client;
		try {
			await collection.aggregate(
				[
					{
						$match: {
							'loc.coordinates': {
								$geoWithin: {
									$geometry: {
										type: gtype
										, coordinates: gcoordinates
									}
								}
							}
						}
					}
					, {
						$limit: this.paramN(n, 10000)
					}
				]
			)
			.toArray()
				.then(
					(data: any[]) => {
						data = data.map(
							(v) => {
								if (type == 'PostOffice') {
									return {
										'name': v.properties.P30_005
										, 'lat': v.loc.coordinates[1]
										, 'lon': v.loc.coordinates[0]
									};
								}
								else if (type == 'RoadsiteStation') {
									return {
										'name': v.properties.P35_006
										, 'lat': v.loc.coordinates[1]
										, 'lon': v.loc.coordinates[0]
									};
								}
							}
						);
						res.json(data);
						res.end();

						if (client) {
							client.close();
							client = null;
						}
					}
				);
		}
		catch(e){
			syslog.error(e);
			res.status(400).send({ message : 'param[coordinates] error' });
			res.end();
		}
		finally {
			if (client) {
				client.close();
			}
		}
	}
}