import express from 'express';
import { maps, mapsLatLon } from '../ts/maps';

interface apiMapsLatLonData {
	status: boolean
	, lat: number
	, lon: number
}

export class apiMapsLatLon {
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
		router.get(this.uri + '/tky2jgdg',
			(req:express.Request, res:express.Response) => {
				const data: apiMapsLatLonData = {
					status: false
					, lat: 0
					, lon: 0
				};

				const oMaps: maps = new maps();

				if (req.query.lat && req.query.lon) {
					const lat: number = +req.query.lat;
					const lon: number = +req.query.lon;
					if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
						const pos: mapsLatLon = oMaps.tky2jgdG(lat, lon);
						data.status = true;
						data.lat = pos.lat;
						data.lon = pos.lon;
					}
				}

				res.json(data);
				res.end();
			}
		);

		router.get(this.uri + '/jgd2tkyg',
			(req:express.Request, res:express.Response) => {
				const data: apiMapsLatLonData = {
					status: false
					, lat: 0
					, lon: 0
				};

				const oMaps: maps = new maps();

				if (req.query.lat && req.query.lon) {
					const lat: number = +req.query.lat;
					const lon: number = +req.query.lon;
					if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
						const pos: mapsLatLon = oMaps.jgd2tkyG(lat, lon);
						data.status = true;
						data.lat = pos.lat;
						data.lon = pos.lon;
					}
				}

				res.json(data);
				res.end();
			}
		);
	}
}