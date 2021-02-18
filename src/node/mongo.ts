import { MongoClient, MongoClientOptions, Db, Collection } from 'mongodb';

export class mongo {
	public uri = '';

	private dbName = 'maps';
	private dbURL = '';
	public client: MongoClient | null = null;
	private clientOptions: MongoClientOptions = {};

	/**
	 * コンストラクター
	 * @param uri API URI
	 * @param host ホスト名
	 * @param port ポート番号
	 */
	constructor(uri: string, host: string, port: number) {
		this.uri = uri;

		this.dbURL = `mongodb://${host}:${port}`;

		this.clientOptions.useNewUrlParser = true;
		this.clientOptions.useUnifiedTopology = true;
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
		return await this.connect('pref');
	}

	/**
	 * 接続：Collection：prefCapital
	 * @returns
	 */
	public async connectPrefCapital(): Promise<Collection | null> {
		return await this.connect('prefCapital');
	}

	/**
	 * 接続：Collection：prefCity
	 * @returns
	 */
	public async connectPrefCity(): Promise<Collection | null> {
		return await this.connect('prefCity');
	}

	/**
	 * 接続：Collection：postOffice
	 * @returns
	 */
	public async connectPostOffice(): Promise<Collection | null> {
		return await this.connect('postOffice');
	}

	/**
	 * 接続：Collection：postOffice
	 * @returns
	 */
	public async connectRoadsiteStation(): Promise<Collection | null> {
		return await this.connect('roadsiteStation');
	}
}