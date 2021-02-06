import express from 'express';
import { maps, mapsTile, mapsLatLon } from '../ts/maps';

interface apiMapsLatLonData {
	status: boolean
	, lat: number
	, lon: number
};

interface apiMapsTileData {
	status: boolean
	, x: number
	, y: number
	, z: number
	, px_x: number
	, px_y: number
};

interface apiMapsTileScale {
	status: boolean
	, scale: number
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

		// タイル座標から緯度経度を取得
		router.get(this.uri + '/tile2latlon',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsLatLonData = {
					status: false
					, lat: 0
					, lon: 0
				};

				const oMaps: maps = new maps();

				if (req.query.x && req.query.y && req.query.z) {
					const x: number = +req.query.x;
					const y: number = +req.query.y;
					const z: number = +req.query.z;
					if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
						const pos: mapsLatLon = oMaps.tile2LatLon(x, y, z);
						data.status = true;
						data.lat = pos.lat;
						data.lon = pos.lon;
					}
				}

				res.json(data);
				res.end();
			}
		);

		// タイル座標のズームレベルから縮尺を取得
		router.get(this.uri + '/tilescale',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsTileScale = {
					status: false
					, scale: 0
				};

				const oMaps: maps = new maps();

				if (req.query.lat && req.query.z && req.query.dpi) {
					const lat: number = +req.query.lat;
					const z: number = +req.query.z;
					const dpi: number = +req.query.dpi;
					if (!Number.isNaN(lat) && !Number.isNaN(z) && !Number.isNaN(dpi)) {
						const scale: number = oMaps.tileScale(z, lat, dpi);
						data.status = true;
						data.scale = scale;
					}
				}

				res.json(data);
				res.end();
			}
		);
	}
}