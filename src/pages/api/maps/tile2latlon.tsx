import { NextApiRequest, NextApiResponse } from "next";
import { mapsApiTile2latlon } from "../../../api/maps";

/**
 * タイル座標から緯度経度を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		mapsApiTile2latlon(
			req.query.x ? +req.query.x : undefined,
			req.query.y ? +req.query.y : undefined,
			req.query.z ? +req.query.z : undefined
		)
	);
	res.end();
};
