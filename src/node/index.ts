import os from 'os';
import express from 'express';

import { mongo } from './mongo';

import { page } from './page';
import { api } from './api';
import { apiMapsDeg } from './apiMapsDeg';
import { apiMapsLatLon } from './apiMapsLatLon';
import { apiMapsDistance } from './apiMapsDistance';
import { apiMapsTile } from './apiMapsTile';

const hostname = os.hostname();

const app:express.Express = express();
const router: express.Router = express.Router();

if (hostname === "maps") {
	// mongo
	const oMongo: mongo = new mongo('mongo', 8517);
}

// page
const oPage: page = new page('/');
oPage.regist(router);

// api
const apiURI = '/api/maps';
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