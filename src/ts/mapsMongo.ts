import { MongoClient, MongoClientOptions, Db, Collection } from "mongodb";
import { log } from "./log";

// 定義：Collection：PrefCapita
type mapsMongoCollectionPrefcapital = {
	pref: string;
	addr: string;
	loc: number[];
	distance: string;
};

// 定義：エラー
export type mapsMongoError = {
	(argv: mapsMongoErrorMessage): void;
};

// 定義：エラー：メッセージ
export type mapsMongoErrorMessage = {
	message: string;
};

// 定義：Near：Data
export type mapsMongoNearData = {
	// 都道府県名
	pref: string;
	// 住所
	addr: string;
	// 緯度
	lat: number;
	// 経度
	lon: number;
	// 距離[m]
	distance: string;
};

// 定義：Near：リクエスト成功結果
export type mapsMongoNearSuccess = {
	(r: mapsMongoNearData[]): void;
};

// 定義：PointInPolygon：Data
export type mapsMongoPointInPolygonData = {
	// ポリゴンタイトル
	name: string;
	// 緯度
	lat: number;
	// 経度
	lon: number;
};

// 定義：PointInPolygon：リクエスト成功結果
export type mapsMongoPointInPolygonSuccess = {
	(r: mapsMongoPointInPolygonData[]): void;
};
export class mapsMongo {
	private dbName = "maps";
	private dbURL = "";
	public client: MongoClient | null = null;
	private clientOptions: MongoClientOptions = {};
	private syslog: log;

	/**
	 * コンストラクター
	 * @param host ホスト名
	 * @param port ポート番号
	 * @param dirLogs ログフォルダー
	 */
	constructor(host: string, port: number, dirLogs: string) {
		this.dbURL = `mongodb://${host}:${port}`;

		this.clientOptions.useNewUrlParser = true;
		this.clientOptions.useUnifiedTopology = true;

		this.syslog = new log(dirLogs);
	}

	/**
	 * ログ：情報
	 * @param message メッセージ
	 */
	public logInfo(message: string): void {
		this.syslog.info(message);
	}

	/**
	 * ログ：エラー
	 * @param message メッセージ
	 */
	public logError(message: string): void {
		this.syslog.error(message);
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
		} catch {
			if (this.client) {
				void this.client.close();
			}
		}

		return null;
	}

	/**
	 * 接続：Collection：pref
	 * @returns
	 */
	public async connectPref(): Promise<Collection | null> {
		return await this.connect("pref");
	}

	/**
	 * 接続：Collection：prefCapital
	 * @returns
	 */
	public async connectPrefCapital(): Promise<Collection | null> {
		return await this.connect("prefCapital");
	}

	/**
	 * 接続：Collection：prefCity
	 * @returns
	 */
	public async connectPrefCity(): Promise<Collection | null> {
		return await this.connect("prefCity");
	}

	/**
	 * 接続：Collection：postOffice
	 * @returns
	 */
	public async connectPostOffice(): Promise<Collection | null> {
		return await this.connect("postOffice");
	}

	/**
	 * 接続：Collection：postOffice
	 * @returns
	 */
	public async connectRoadsiteStation(): Promise<Collection | null> {
		return await this.connect("roadsiteStation");
	}

	/**
	 * パラメーター引数：取得件数
	 * @param n 取得件数：0 = 全件, 1 <= n <= max
	 * @param max 最大件数
	 * @returns 取得件数：0 = 全件, 1 <= n <= max
	 */
	public paramN(n: number, max: number): number {
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
	 * 指定した緯度経度に近いポイントの緯度経度と距離（m）を取得
	 * @param lat 緯度
	 * @param lon 経度
	 * @param n 取得件数0 = 全件, 1 <= n <= 100
	 * @param resSucces レスポンス（成功）
	 * @param resError レスポンス（失敗）
	 */
	public async near(
		lat: number,
		lon: number,
		n: number,
		resSucces: mapsMongoNearSuccess,
		resError: mapsMongoError
	): Promise<void> {
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
				.then((data: mapsMongoCollectionPrefcapital[]) => {
					const r: mapsMongoNearData[] = data.map(
						(v: mapsMongoCollectionPrefcapital): mapsMongoNearData => {
							return {
								pref: v.pref,
								addr: v.addr,
								lat: v.loc[1],
								lon: v.loc[0],
								distance: v.distance,
							};
						}
					);
					resSucces(r);

					if (client) {
						void client.close();
						client = null;
					}
				});
		} catch (e) {
			this.logError(e);
			resError({ message: "param[coordinates] error" });
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
	 * @param resSucces レスポンス（成功）
	 * @param resError レスポンス（失敗）
	 */
	public async pointInPolygon(
		type: string,
		gtype: string,
		gcoordinates: [],
		n: number,
		resSucces: mapsMongoPointInPolygonSuccess,
		resError: mapsMongoError
	): Promise<void> {
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
						const r: mapsMongoPointInPolygonData[] = data.map(
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
						resSucces(r);

						if (client) {
							void client.close();
							client = null;
						}
					}
				);
		} catch (e) {
			this.logError(e);
			resError({ message: "param[coordinates] error" });
		} finally {
			if (client) {
				void client.close();
			}
		}
	}
}
