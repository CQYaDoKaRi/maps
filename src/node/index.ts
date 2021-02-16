import os from 'os';
import express from 'express';
import bodyParser from 'body-parser';

import { mongoCreate } from './mongoCreate';
import { mongoApi } from './mongoApi';

import { page } from './page';
import { api } from './api';
import { apiMapsDeg } from './apiMapsDeg';
import { apiMapsLatLon } from './apiMapsLatLon';
import { apiMapsDistance } from './apiMapsDistance';
import { apiMapsTile } from './apiMapsTile';

const hostname = os.hostname();

const app:express.Express = express();
const router: express.Router = express.Router();

const apiURI: string = '/api/maps';

// MongoDB
if (hostname === 'maps') {
	const mongoApiUri: string = apiURI;
	const mongoApiHost: string = 'mongo';
	const mongoApiPort: number = 8517;

	// - Create
	const oMongoCreate: mongoCreate = new mongoCreate(mongoApiUri, mongoApiHost, mongoApiPort);
	oMongoCreate.collections();

	// - api
	const oMongoApi: mongoApi = new mongoApi(mongoApiUri, mongoApiHost, mongoApiPort);
	oMongoApi.regist(router);
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

// - POST
app.use(bodyParser.urlencoded(
	{
		extended: true
		, limit: '10mb'
	}
));
app.use(bodyParser.json(
	{
		limit: '10mb'
	}
));

app.use(router);
app.use('/', express.static('public'));

app.listen(8080, () => {
	console.log('Start server : maps')
});