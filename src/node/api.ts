import express from "express";
import swaggerUi from "swagger-ui-express";
import yamljs from "yamljs";

export class api {
	private uri = "";

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string) {
		this.uri = uri;
	}

	/**
	 * 登録
	 * @param app express
	 */
	public regist(app: express.Express): void {
		// maps - SwaggerUI
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const swaggerDocument: swaggerUi.JsonObject = yamljs.load("./api/swagger/maps.yaml");
		app.use(this.uri + "/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}
}
