import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsDirection } from "../../../api/maps";

/**
 * 角度・距離から緯度経度を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		apiMapsDirection(
			req.query.lat1 ? +req.query.lat1 : undefined,
			req.query.lon1 ? +req.query.lon1 : undefined,
			req.query.lat2 ? +req.query.lat2 : undefined,
			req.query.lon2 ? +req.query.lon2 : undefined
		)
	);
	res.end();
};
