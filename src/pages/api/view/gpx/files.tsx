import { NextApiRequest, NextApiResponse } from "next";
import { apiViewGpxFiles } from "../../../../api/view";

/**
 * GPX ファイルリストを取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(apiViewGpxFiles(`${process.cwd()}/public/data`));
	res.end();
};
