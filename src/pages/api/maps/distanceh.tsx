import { NextApiRequest, NextApiResponse } from "next";
import { mapsApiDistance } from "../../../api/maps";

/**
 * ２地点間の距離：ヒュベニ
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		mapsApiDistance(
			"H",
			req.query.lat1 ? +req.query.lat1 : undefined,
			req.query.lon1 ? +req.query.lon1 : undefined,
			req.query.lat2 ? +req.query.lat2 : undefined,
			req.query.lon2 ? +req.query.lon2 : undefined
		)
	);
	res.end();
};
