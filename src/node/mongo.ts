import chalk from 'chalk';
import express from 'express';
import { MongoClient, MongoClientOptions, Db, Collection } from 'mongodb'
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from '../ts/mapsDataPrefCapital';

export class mongo {
	private uri = '';
	private dbName: string = 'maps';
	private dbURL: string = '';
	private client: MongoClient | null = null;
	private clientOptions: MongoClientOptions = {};

	/**
	 * コンストラクター
	 * @param uri API URI
	 * @param host ホスト名
	 * @param port ポート番号
	 */
	constructor(uri: string, host: string, port: number) {
		this.uri = uri;

		this.dbURL = 'mongodb://' + host + ":" + port;

		this.clientOptions.useNewUrlParser = true;
		this.clientOptions.useUnifiedTopology = true

		this.init();
	}

	/**
	 * 接続
	 * @returns
	 */
	private async connect(collectionName: string): Promise<Collection | null> {
		// 接続
		this.client = await MongoClient.connect(this.dbURL, this.clientOptions);
		if (!this.client) {
			return null;
		}

		try {
			// 接続：DB
			const db: Db = this.client.db(this.dbName);

			// 接続：collection
			return db.collection(collectionName);
		}
		catch {
			if (this.client) {
				this.client.close();
			}
		}

		return null;
	}

	/**
	 * 接続：Collection：prefCapital
	 * @returns
	 */
	private async connectPrefCapital(): Promise<Collection | null> {
		return await this.connect('prefCapital');
	}

	/**
	 * 初期処理
	 * @returns
	 */
	private async init(): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectPrefCapital();
		if (!collection) {
			return;
		}

		try {
			// 件数
			const n = await collection.find().count();
			if(n > 0){
				return;
			}

			// 件数がない場合：データを挿入
			console.log(chalk.blue('MongoDB > create - prefCapital ...'));
			// - 地図：データ：都道府県庁
			const oMapsDataPrefCapital: mapsDataPrefCapital = new mapsDataPrefCapital();
			const dMapsDataPrefCapital: mapsDataPrefCapitalItem[] = oMapsDataPrefCapital.get();

			await Promise.all(
				dMapsDataPrefCapital.map(
					async(item: mapsDataPrefCapitalItem) => {
						try{
							await collection.insertOne({
								"pref": item.pref
								, "addr": item.addr
								, loc: [item.lon, item.lat]
							});
						}
						catch{
						}
					}
				)
			);

			// - 地図：データ：座標にインデックスを作成
			await collection.createIndex(
				{
					loc: '2dsphere'
				}
			);
			console.log(chalk.blue('MongoDB > create - prefCapital ... completed'));
		}
		finally {
			if (this.client) {
				this.client.close();
			}
		}
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public async regist(router: express.Router): Promise<void> {
		router.get(this.uri + '/mongo/prefcapital/near',
			(req:express.Request, res:express.Response) => {
				if (req.query.lat && req.query.lon && req.query.n) {
					const lat: number = +req.query.lat;
					const lon: number = +req.query.lon;
					const n: number = +req.query.n;
					if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(n)) {
						this.near(lat, lon, n, res);
						return;
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
	public async near(lat: number, lon: number, n: number, res:express.Response): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectPrefCapital();
		if (!collection) {
			return;
		}

		try {
			if( n === 0){
				n = 100;
			}
			else if (n < 1 ) {
				n = 1;
			}
			else if (n > 100) {
				n = 100;
			}

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
						$limit: n
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
					}
				);
		}
		finally {
			if (this.client) {
				this.client.close();
			}
		}
	}
}