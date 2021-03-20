import { NextApiRequest, NextApiResponse } from "next";
import { mapsApiDeg2Name } from "../../../api/maps";

export default (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200);
	res.json(mapsApiDeg2Name(req.query.deg ? +req.query.deg : undefined));
	res.end();
};
