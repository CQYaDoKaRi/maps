import { NextApiRequest, NextApiResponse } from "next";
import { mapsApiTile } from "../../../api/maps";

/**
 * 緯度経度・ズームレベルからタイル座標を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		mapsApiTile(
			req.query.lat ? +req.query.lat : undefined,
			req.query.lon ? +req.query.lon : undefined,
			req.query.z ? +req.query.z : undefined
		)
	);
	res.end();
};
