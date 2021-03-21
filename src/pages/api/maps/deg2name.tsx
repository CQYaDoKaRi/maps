import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsDeg2Name } from "../../../api/maps";

/**
 * 方位角を12方位名に変換
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(apiMapsDeg2Name(req.query.deg ? +req.query.deg : undefined));
	res.end();
};
