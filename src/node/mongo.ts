import chalk from 'chalk';
import { MongoClient, MongoClientOptions, Db, Collection } from 'mongodb'
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from '../ts/mapsDataPrefCapital';

export class mongo {
	private dbName: string = 'maps';
	private dbURL: string = '';
	private client: MongoClient | null = null;
	private clientOptions: MongoClientOptions = {};

	/**
	 * コンストラクター
	 * @param host ホスト名
	 * @param port ポート番号
	 */
	constructor(host: string, port: number) {
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
		if(!collection){
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
			console.log(chalk.blue('MongoDB > create - prefCapital ... completed'));
		}
		finally {
			if (this.client) {
				this.client.close();
			}
		}
	}
}