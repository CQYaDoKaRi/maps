import os from 'os';
import express from 'express';

import { mongo } from './mongo';
import { mongoCreate } from './mongoCreate';

import { page } from './page';
import { api } from './api';
import { apiMapsDeg } from './apiMapsDeg';
import { apiMapsLatLon } from './apiMapsLatLon';
import { apiMapsDistance } from './apiMapsDistance';
import { apiMapsTile } from './apiMapsTile';

const hostname = os.hostname();

const app:express.Express = express();
const router: express.Router = express.Router();

const apiURI = '/api/maps';

// MongoDB
if (hostname === "maps") {
	// MongoDB - Create
	const oMongoCreate: mongoCreate = new mongoCreate(apiURI, 'mongo', 8517);
	oMongoCreate.collections();

	// MongoDB - api
	const oMongo: mongo = new mongo(apiURI, 'mongo', 8517);
	oMongo.regist(router);
}

// page
const oPage: page = new page('/');
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

// app
// - CORS の許可
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
});

app.use(router);
app.use('/', express.static('public'));

app.listen(8080, () => {
	console.log('Start server : maps')
});