import { NextApiRequest, NextApiResponse } from "next";
import { mapsApiTileScale } from "../../../api/maps";

/**
 * タイル座標のズームレベルから縮尺を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		mapsApiTileScale(
			req.query.lat ? +req.query.lat : undefined,
			req.query.z ? +req.query.z : undefined,
			req.query.dpi ? +req.query.dpi : undefined
		)
	);
	res.end();
};
