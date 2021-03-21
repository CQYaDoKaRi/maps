import { NextApiRequest, NextApiResponse } from "next";
import { mapApiTileDemUrl } from "../../../../api/maps";

/**
 * 標高タイルURLを取得[png]
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		mapApiTileDemUrl(
			"png",
			req.query.x ? +req.query.x : undefined,
			req.query.y ? +req.query.y : undefined,
			req.query.z ? +req.query.z : undefined
		)
	);
	res.end();
};
