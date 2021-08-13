import { NextApiRequest, NextApiResponse } from "next";
import { apiMapsJgd2tkyG } from "../../../api/maps";

/**
 * 世界測地系を日本測地系に変換（1次式）
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(apiMapsJgd2tkyG(req.query.lat ? +req.query.lat : undefined, req.query.lon ? +req.query.lon : undefined));
	res.end();
};
