import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsTile2z } from "../../../api/maps";

/**
 * タイル座標のズームレベルを変更した場合のタイル座標を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(
		apiMapsTile2z(
			req.query.x ? +req.query.x : undefined,
			req.query.y ? +req.query.y : undefined,
			req.query.z ? +req.query.z : undefined,
			req.query.toz ? +req.query.toz : undefined
		)
	);
	res.end();
};