import chalk from 'chalk';
import { MongoClient, MongoClientOptions, Db, Collection } from 'mongodb'
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from '../ts/mapsDataPrefCapital';

export class mongo {

	/**
	 * コンストラクター
	 * @param host ホスト名
	 * @param port ポート番号
	 */
	constructor(host: string, port: number){
		const url: string = 'mongodb://' + host + ":" + port;

		const options: MongoClientOptions = {
			useNewUrlParser: true
			, useUnifiedTopology: true
		};

		this.init(url, options);
	}

	/**
	 * 初期処理
	 * @param url MongoDB 接続 URL
	 * @param options MongoDB 接続オプション
	 */
	private async init(url: string, options: MongoClientOptions){
		// 接続
		const client = await MongoClient.connect(url, options);
		if(!client){
			return;
		}

		try{
			// 接続：DB
			const db: Db = client.db('maps');
			// 接続：テーブル
			const collection: Collection = db.collection('prefCapital');

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
								, "lat": item.lat
								, "lon": item.lon
							});
						}
						catch{
						}
					}
				)
			);
			console.log(chalk.blue('MongoDB > create - prefCapital ... completed'));
		}
		finally{
			client.close();
		}
	}
}