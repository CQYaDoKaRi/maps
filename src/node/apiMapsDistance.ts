import express from 'express';
import { maps, mapsLatLon } from '../ts/maps';

interface apiMapsDistanceData {
	status: boolean
	, distance: number
};

interface apiMapsDistanceToData {
	status: boolean
	, lat: number
	, lon: number
};

export class apiMapsDistance {
	private uri = '';

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string){
		this.uri = uri;
	}

	/**
	 * ２地点間の距離
	 * @param type T:球面三角法,H:ヒュベニ,S:測地線航海算法
	 * @param req リクエスト
	 * @returns 結果
	 */
	private distance(type: string, req:express.Request): apiMapsDistanceData{
		let data: apiMapsDistanceData = {
			status: false
			, distance: 0
		};

		const oMaps: maps = new maps();

		if (type === 'T' || type === 'H' || type === 'S') {
			if (req.query.lat1 && req.query.lon1 && req.query.lat2 && req.query.lon2) {
				const lat1: number = +req.query.lat1;
				const lon1: number = +req.query.lon1;
				const lat2: number = +req.query.lat2;
				const lon2: number = +req.query.lon2;
				if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
					if (type === 'T') {
						const distance: number = oMaps.distanceT(lat1, lon1, lat2, lon2);
						data.status = true;
						data.distance = distance;
					}
					else if (type === 'H') {
						const distance: number = oMaps.distanceH(lat1, lon1, lat2, lon2);
						data.status = true;
						data.distance = distance;
					}
					else if (type === 'S') {
						const distance: number = oMaps.distanceS(lat1, lon1, lat2, lon2);
						data.status = true;
						data.distance = distance;
					}
				}
			}
		}

		return data;
	}

	/**
	 * 角度・距離から緯度経度を取得
	 * @param req リクエスト
	 * @returns 結果
	 */
	private distanceTo(req:express.Request): apiMapsDistanceToData{
		let data: apiMapsDistanceToData = {
			status: false
			, lat: 0
			, lon: 0
		};

		const oMaps: maps = new maps();

		if (req.query.lat && req.query.lon && req.query.a && req.query.len) {
			const lat: number = +req.query.lat;
			const lon: number = +req.query.lon;
			const a: number = +req.query.a;
			const len: number = +req.query.len;
			if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(a) && !Number.isNaN(len)) {
				const pos: mapsLatLon  = oMaps.distanceTo(lat, lon, a, len);
				data.status = true;
				data.lat = pos.lat;
				data.lon = pos.lon;
			}
		}

		return data;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		// ２地点間の距離：球面三角法
		router.get(this.uri + '/distancet',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsDistanceData = {
					status: false
					, distance: 0
				};
				data = this.distance('T', req);

				res.json(data);
				res.end();
			}
		);

		// ２地点間の距離：ヒュベニ
		router.get(this.uri + '/distanceh',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsDistanceData = {
					status: false
					, distance: 0
				};
				data = this.distance('H', req);

				res.json(data);
				res.end();
			}
		);

		// ２地点間の距離：測地線航海算法
		router.get(this.uri + '/distances',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsDistanceData = {
					status: false
					, distance: 0
				};
				data = this.distance('S', req);

				res.json(data);
				res.end();
			}
		);

		// 角度・距離から緯度経度を取得
		router.get(this.uri + '/distanceto',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsDistanceToData = {
					status: false
					, lat: 0
					, lon: 0
				};
				data = this.distanceTo(req);

				res.json(data);
				res.end();
			}
		);
	}
}