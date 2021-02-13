import fs from 'fs';
import chalk from 'chalk';
import { Collection } from 'mongodb'
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from '../ts/mapsDataPrefCapital';
import { mongo } from './mongo';

interface geojson {
	features : geojsonFeatures[]
}

interface geojsonFeatures {
	properties: {}
	geometry: {}
}

export class mongoCreate extends mongo {
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
	 * 初期処理
	 * @returns
	 */
	public async collections(): Promise<void> {
		await this.collectionPref();
		await this.collectionPrefCapital();
	}

	/**
	 * 初期処理：都道府県 - Polygon
	 * @returns
	 */
	private async collectionPref(): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectPref();
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
			console.log(chalk.blue('MongoDB > create - pref ...'));

			// - 地図：データ
			const mapsDataPref: geojson = JSON.parse(fs.readFileSync('./public/data/dPref.geojson', 'utf-8'));
			const oData: geojsonFeatures[] = mapsDataPref.features;

			await Promise.all(
				oData.map(
					async(item: geojsonFeatures) => {
						try{
							await collection.insertOne({
								properties: item.properties
								, loc: item.geometry
							});
						}
						catch{
						}
					}
				)
			);

			console.log(chalk.blue('MongoDB > create - pref ... completed'));
		}
		finally {
			if (this.client) {
				this.client.close();
			}
		}
	}

	/**
	 * 初期処理：都道府県庁 - Point
	 * @returns
	 */
	private async collectionPrefCapital(): Promise<void> {
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
								pref: item.pref
								, addr: item.addr
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
}