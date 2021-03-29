import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsTky2jgdG } from "../../../api/maps";

/**
 * 日本測地系を世界測地系に変換（1次式）
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(apiMapsTky2jgdG(req.query.lat ? +req.query.lat : undefined, req.query.lon ? +req.query.lon : undefined));
	res.end();
};