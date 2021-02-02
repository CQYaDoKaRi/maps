import express from 'express';
import { maps } from '../ts/maps';

interface apiMapsDegData {
	status: boolean
	, name: string
};

export class apiMapsDeg {
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
		router.get(this.uri + '/deg2name',
			(req:express.Request, res:express.Response) => {
				let data: apiMapsDegData = {
					status: false
					, name: ""
				};
				
				const oMaps: maps = new maps();
				
				if (req.query.deg) {
					const deg: number = +req.query.deg
					if (!Number.isNaN(deg)) {
						data.status = true;
						data.name = oMaps.deg2Name(deg);
					}
				}
				
				res.json(data);
				res.end();
			}
		);	
	}
}