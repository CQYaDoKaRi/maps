import os from "os";
import express from "express";
import bodyParser from "body-parser";

import { mongoCreate } from "./mongoCreate";
import { mongoApi } from "./mongoApi";

import { log } from "./log";
import { page } from "./page";
import { api } from "./api";
import { apiMapsDeg } from "./apiMapsDeg";
import { apiMapsLatLon } from "./apiMapsLatLon";
import { apiMapsDistance } from "./apiMapsDistance";
import { apiMapsTile } from "./apiMapsTile";
import { apiView } from "./apiView";

const hostname = os.hostname();
const syslog: log = new log("maps");

const app: express.Express = express();
const router: express.Router = express.Router();

let apiURI = "/api/maps";

// MongoDB
if (hostname === "maps") {
	const mongoApiUri: string = apiURI;
	const mongoApiHost = "mongo";
	const mongoApiPort = 8517;

	// - Create
	const oMongoCreate: mongoCreate = new mongoCreate(mongoApiUri, mongoApiHost, mongoApiPort);
	void oMongoCreate.collections();

	// - api
	const oMongoApi: mongoApi = new mongoApi(mongoApiUri, mongoApiHost, mongoApiPort);
	void oMongoApi.regist(router);
}

// page
const oPage: page = new page("/");
oPage.regist(router);

// api
const oApi: api = new api(apiURI);
oApi.regist(app);

// api - maps
const oApiMapsDeg: apiMapsDeg = new apiMapsDeg(apiURI);
oApiMapsDeg.regist(router);

const oApiMapsLatLon: apiMapsLatLon = new apiMapsLatLon(apiURI);
oApiMapsLatLon.regist(router);

const oApiMapsDistance: apiMapsDistance = new apiMapsDistance(apiURI);
oApiMapsDistance.regist(router);

const oApiMapsTile: apiMapsTile = new apiMapsTile(apiURI);
oApiMapsTile.regist(router);

// api - view
apiURI = "/api";
const oApiView: apiView = new apiView(apiURI);
oApiView.regist(router);

// app
// - CORS の許可
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// - POST
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: "10mb",
	})
);
app.use(
	bodyParser.json({
		limit: "10mb",
	})
);

app.use(router);
app.use("/", express.static("public"));

app.listen(8080, () => {
	syslog.info("Start server : maps");
});
