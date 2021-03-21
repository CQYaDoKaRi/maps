import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsDistanceTo } from "../../../api/maps";

/**
 * 角度・距離から緯度経度を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		apiMapsDistanceTo(
			req.query.lat ? +req.query.lat : undefined,
			req.query.lon ? +req.query.lon : undefined,
			req.query.a ? +req.query.a : undefined,
			req.query.len ? +req.query.len : undefined
		)
	);
	res.end();
};
