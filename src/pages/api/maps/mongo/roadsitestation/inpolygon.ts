import { NextApiRequest, NextApiResponse } from "next";
import { mapsMongoPointInPolygonData, mapsMongoPointInPolygonErrorMessage } from "../../../../../ts/mapsMongo";
import { apiMongoHost, apiMongoPort } from "../../../../../api/config";
import { apiMapsMongoPointInPolygon } from "../../../../../api/mapsMongo";

/**
 * 指定したポリゴンに含まれる道の駅を取得
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	const d_gtype: string = req.query.gtype ? req.query.gtype : req.body.gtype;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	const d_gcoordinates: string = req.query.gcoordinates ? req.query.gcoordinates : req.body.gcoordinates;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	const d_n: number = req.query.n ? +req.query.n : +req.body.n;

	if (
		!apiMapsMongoPointInPolygon(
			apiMongoHost,
			apiMongoPort,
			"RoadsiteStation",
			d_gtype,
			d_gcoordinates,
			d_n,
			(r: mapsMongoPointInPolygonData[]) => {
				res.status(200);
				res.send(r);
				res.end();
			},
			(e: mapsMongoPointInPolygonErrorMessage) => {
				res.status(400).send(e);
				res.end();
			}
		)
	) {
		res.json({});
		res.end();
	}
};
