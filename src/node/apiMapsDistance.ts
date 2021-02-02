import express from 'express';
import { maps } from '../ts/maps';

interface apiMapsDistanceData {
	status: boolean
	, distance: number
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
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
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
	}
}