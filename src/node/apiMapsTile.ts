import express from 'express';
import { maps, mapsTile  } from '../ts/maps';

interface apiMapsTileData {
	status: boolean
	, x: number
	, y: number
	, z: number
	, px_x: number
	, px_y: number
};

export class apiMapsTile {
	private uri = '';

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string){
		this.uri = uri;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		// 緯度経度・ズームレベルからタイル座標を取得
		router.get(this.uri + '/tile',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsTileData = {
					status: false
					, x: 0
					, y: 0
					, z: 0
					, px_x: 0
					, px_y: 0
				};

				const oMaps: maps = new maps();

				if (req.query.lat && req.query.lon && req.query.z) {
					const lat: number = +req.query.lat;
					const lon: number = +req.query.lon;
					const z: number = +req.query.z;
					if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(z)) {
						const tile: mapsTile = oMaps.tile(lat, lon, z);
						data.status = true;
						data.x = tile.x;
						data.y = tile.y;
						data.z = tile.z;
						data.px_x = tile.px_x;
						data.px_y = tile.px_y;
					}
				}

				res.json(data);
				res.end();
			}
		);
	}
}