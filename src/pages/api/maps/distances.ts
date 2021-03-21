import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsDistance } from "../../../api/maps";

/**
 * ２地点間の距離：測地線航海算法
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		apiMapsDistance(
			"S",
			req.query.lat1 ? +req.query.lat1 : undefined,
			req.query.lon1 ? +req.query.lon1 : undefined,
			req.query.lat2 ? +req.query.lat2 : undefined,
			req.query.lon2 ? +req.query.lon2 : undefined
		)
	);
	res.end();
};
