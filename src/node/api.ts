import os from "os";
// express
import express from "express";
// swagger
import swaggerUi from "swagger-ui-express";
import yamljs from "yamljs";
// api
import { apiMapsDeg } from "./apiMapsDeg";
import { apiMapsLatLon } from "./apiMapsLatLon";
import { apiMapsDistance } from "./apiMapsDistance";
import { apiMapsTile } from "./apiMapsTile";
import { apiView } from "./apiView";
// api - mongoDB
import { mongoCreate } from "./mongoCreate";
import { mongoApi } from "./mongoApi";
export class api {
	private uri = "";
	private uriMaps = "";
	private mongoHost = "mongo";
	private mongoPort = 8517;

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
			// - Create
			const oMongoCreate: mongoCreate = new mongoCreate(this.uriMaps, this.mongoHost, this.mongoPort);
			void oMongoCreate.collections();

			// - api
			const oMongoApi: mongoApi = new mongoApi(this.uriMaps, this.mongoHost, this.mongoPort);
			void oMongoApi.regist(router);
		}

		// api - maps
		const oApiMapsDeg: apiMapsDeg = new apiMapsDeg(this.uriMaps);
		oApiMapsDeg.regist(router);

		const oApiMapsLatLon: apiMapsLatLon = new apiMapsLatLon(this.uriMaps);
		oApiMapsLatLon.regist(router);

		const oApiMapsDistance: apiMapsDistance = new apiMapsDistance(this.uriMaps);
		oApiMapsDistance.regist(router);

		const oApiMapsTile: apiMapsTile = new apiMapsTile(this.uriMaps);
		oApiMapsTile.regist(router);

		// api - view
		const oApiView: apiView = new apiView(this.uri);
		oApiView.regist(router);

		app.use(router);
	}
}
