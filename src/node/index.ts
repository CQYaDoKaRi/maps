import express from 'express';
import swaggerUi from 'swagger-ui-express'
import yamljs from 'yamljs'

import { maps, mapsLatLon } from '../ts/maps';

const app:express.Express = express();

// CORS の許可
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
});

const router: express.Router = express.Router();
router.get('/',
        (req:express.Request, res:express.Response) => {
			let html = [];

			html.push('<!DOCTYPE html>');
			html.push('<html>');
			html.push('<head>');

			html.push('<meta http-equiv=\'refresh\' content=\'0; URL=index.html\'>');
			html.push('<title>maps</title>');

			html.push('</head>');
			html.push('<body>');
			html.push('</body>');
			html.push('</html>');

			res.send(html.join(''));
			res.end();
        }
);

// API - maps - SwaggerUI
const swaggerDocument = yamljs.load('./api/swagger/maps.yaml');
app.use('/api/maps/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// API - maps
interface mapsData_deg2name {
	status: boolean
	, name: string
};
router.get('/api/maps/deg2name',
	(req:express.Request, res:express.Response) => {
		let data: mapsData_deg2name = {
			status: false
			, name: ""
		};
		
		const oMaps: maps = new maps();
		
		if (req.query.deg) {
			const deg: number = +req.query.deg
			if (!Number.isNaN(deg)) {
				data.status = true;
				data.name = oMaps.deg2Name(deg);
			}
		}
		
		res.json(data);
		res.end();
	}
);

interface mapsData_LatLon {
	status: boolean
	, lat: number
	, lon: number
};
router.get('/api/maps/tky2jgdg',
	(req:express.Request, res:express.Response) => {
		let data: mapsData_LatLon = {
			status: false
			, lat: 0
			, lon: 0
		};
		
		const oMaps: maps = new maps();	
		
		if (req.query.lat && req.query.lon) {
			const lat: number = +req.query.lat;
			const lon: number = +req.query.lon;
			if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
				const pos: mapsLatLon = oMaps.tky2jgdG(lat, lon);
				data.status = true;
				data.lat = pos.lat;
				data.lon = pos.lon;
			}
		}
		
		res.json(data);
		res.end();
	}
);

router.get('/api/maps/jgd2tkyg',
	(req:express.Request, res:express.Response) => {
		let data: mapsData_LatLon = {
			status: false
			, lat: 0
			, lon: 0
		};

		const oMaps: maps = new maps();
		
		if (req.query.lat && req.query.lon) {
			const lat: number = +req.query.lat;
			const lon: number = +req.query.lon;
			if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
				const pos: mapsLatLon = oMaps.jgd2tkyG(lat, lon);
				data.status = true;
				data.lat = pos.lat;
				data.lon = pos.lon;
			}
		}
		
		res.json(data);
		res.end();
	}
);

app.use(router);
app.use('/', express.static('public'));

app.listen(8080, () => {
	console.log('Start server : maps')
});