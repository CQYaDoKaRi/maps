import fs from 'fs';
import chalk from 'chalk';
import { mongo } from './mongo';
import { Collection } from 'mongodb'
import { mapsDataPrefCapital, mapsDataPrefCapitalItem } from '../ts/mapsDataPrefCapital';

import { log } from './log';
const syslog: log = new log('maps.mongo');

interface geojson {
	features : geojsonFeatures[]
}

interface geojsonFeatures {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	properties: any
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	, geometry: any
}

export class mongoCreate extends mongo {
	private pathGeoJSON = './public/data/';

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
		await this.collectionPrefCity();
		await this.collectionPostOffice();
		await this.collectionRoadsiteStation();
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
			syslog.info(chalk.blue('MongoDB > create - pref ...'));

			// - データ
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const json: geojson = JSON.parse(fs.readFileSync(`${this.pathGeoJSON}/dPref.geojson`, 'utf-8'));
			const oData: geojsonFeatures[] = json.features;

			await Promise.all(
				oData.map(
					async(item: geojsonFeatures) => {
						try{
							await collection.insertOne(
								{
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									properties: item.properties
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									, loc: item.geometry
								}
							);
						}
						catch(e){
							syslog.error(e);
						}
					}
				)
			);

			// インデックス
			// - Polygon へのインデックスは [Duplicate vertices] になるため作成しない
			syslog.info(chalk.blue('MongoDB > create - pref ... completed'));
		}
		finally {
			if (this.client) {
				void this.client.close();
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
			syslog.info(chalk.blue('MongoDB > create - prefCapital ...'));
			// - データ：都道府県庁
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
						catch(e){
							syslog.error(e);
						}
					}
				)
			);

			// - データ：座標にインデックスを作成
			await collection.createIndex(
				{
					loc: '2dsphere'
				}
			);
			syslog.info(chalk.blue('MongoDB > create - prefCapital ... completed'));
		}
		finally {
			if (this.client) {
				void this.client.close();
			}
		}
	}

	/**
	 * 初期処理：市区町村界 - Polygon
	 * @returns
	 */
	private async collectionPrefCity(): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectPrefCity();
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
			syslog.info(chalk.blue('MongoDB > create - prefCity ...'));

			// - データ
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const json: geojson = JSON.parse(fs.readFileSync(`${this.pathGeoJSON}/dPrefCity.geojson`, 'utf-8'));
			const oData: geojsonFeatures[] = json.features;

			await Promise.all(
				oData.map(
					async(item: geojsonFeatures) => {
						try{
							await collection.insertOne(
								{
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									properties: item.properties
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									, loc: item.geometry
								}
							);
						}
						catch(e){
							syslog.error(e);
						}
					}
				)
			);

			// インデックス
			// - Polygon へのインデックスは [Duplicate vertices] になるため作成しない
			syslog.info(chalk.blue('MongoDB > create - prefCity ... completed'));
		}
		finally {
			if (this.client) {
				void this.client.close();
			}
		}
	}

	/**
	 * 初期処理：郵便局 - Point
	 * @returns
	 */
	private async collectionPostOffice(): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectPostOffice();
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
			syslog.info(chalk.blue('MongoDB > create - postOffice ...'));

			// - データ
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const json: geojson = JSON.parse(fs.readFileSync(`${this.pathGeoJSON}/dPostOffice.geojson`, 'utf-8'));
			const oData: geojsonFeatures[] = json.features;

			await Promise.all(
				oData.map(
					async(item: geojsonFeatures) => {
						try{
							await collection.insertOne(
								{
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									properties: item.properties
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									, loc: item.geometry
								}
							);
						}
						catch(e){
							syslog.error(e);
						}
					}
				)
			);

			// - データ：座標にインデックスを作成
			await collection.createIndex(
				{
					loc: '2dsphere'
				}
			);
			syslog.info(chalk.blue('MongoDB > create - postOffice ... completed'));
		}
		finally {
			if (this.client) {
				void this.client.close();
			}
		}
	}

	/**
	 * 初期処理：道の駅 - Point
	 * @returns
	 */
	private async collectionRoadsiteStation(): Promise<void> {
		// 接続
		const collection: Collection | null = await this.connectRoadsiteStation();
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
			syslog.info(chalk.blue('MongoDB > create - roadsiteStation ...'));

			// - 地図：データ
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const json: geojson = JSON.parse(fs.readFileSync(`${this.pathGeoJSON}/dRoadsiteStation.geojson`, 'utf-8'));
			const oData: geojsonFeatures[] = json.features;

			await Promise.all(
				oData.map(
					async(item: geojsonFeatures) => {
						try{
							await collection.insertOne(
								{
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									properties: item.properties
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									, loc: item.geometry
								}
							);
						}
						catch(e){
							syslog.error(e);
						}
					}
				)
			);

			// - データ：座標にインデックスを作成
			await collection.createIndex(
				{
					loc: '2dsphere'
				}
			);
			syslog.info(chalk.blue('MongoDB > create - roadsiteStation ... completed'));
		}
		finally {
			if (this.client) {
				void this.client.close();
			}
		}
	}
}