import os from "os";
// express
import express from "express";
// swagger
import swaggerUi from "swagger-ui-express";
import yamljs from "yamljs";
// api
import { apiMongoHost, apiMongoPort } from "../api/config";
import { apiMaps } from "./apiMaps";
import { apiView } from "./apiView";
// api - mongoDB
import { apiMapsMongo } from "./apiMapsMongo";
export class api {
	private uri = "";
	private uriMaps = "";

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string) {
		this.uri = uri;
		this.uriMaps = `${uri}/maps`;
	}

	/**
	 * 登録
	 * @param app express
	 */
	public regist(app: express.Express): void {
		const router = express.Router();

		// app
		// - CORS の許可
		app.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		app.use(
			express.urlencoded({
				extended: true,
				limit: "10mb",
			})
		);
		app.use(
			express.json({
				limit: "10mb",
			})
		);

		// maps - SwaggerUI
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const swaggerDocument: swaggerUi.JsonObject = yamljs.load("./api/swagger/maps.yaml");
		app.use(`${this.uriMaps}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

		const hostname = os.hostname();

		// MongoDB
		if (hostname === "maps") {
			// api
			const oApiMapsMongo: apiMapsMongo = new apiMapsMongo(this.uriMaps, apiMongoHost, apiMongoPort);
			void oApiMapsMongo.regist(router);
		}

		// api - maps
		const oApiMap: apiMaps = new apiMaps(this.uriMaps);
		oApiMap.regist(router);

		// api - view
		const oApiView: apiView = new apiView(this.uri);
		oApiView.regist(router);

		app.use(router);
	}
}
