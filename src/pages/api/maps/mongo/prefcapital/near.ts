import { NextApiRequest, NextApiResponse } from "next";
import { mapsMongoNearData, mapsMongoErrorMessage } from "../../../../../ts/mapsMongo";
import { apiMongoHost, apiMongoPort } from "../../../../../api/config";
import { apiMapsMongoNear } from "../../../../../api/mapsMongo";

/**
 * 指定した緯度経度に近い都道府県庁の緯度経度と距離（m）を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	if (
		!apiMapsMongoNear(
			apiMongoHost,
			apiMongoPort,
			`${process.cwd()}/logs`,
			req.query.lat ? +req.query.lat : 0,
			req.query.lon ? +req.query.lon : 0,
			req.query.n ? +req.query.n : 0,
			(r: mapsMongoNearData[]) => {
				res.status(200);
				res.send(r);
				res.end();
			},
			(e: mapsMongoErrorMessage) => {
				res.status(400).send(e);
				res.end();
			}
		)
	) {
		res.json({});
		res.end();
	}
};
