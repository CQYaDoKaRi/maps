import express from 'express';
import { maps } from '../ts/maps';

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

router.get('/api/maps/deg2name',
	(req:express.Request, res:express.Response) => {
		const oMaps: maps = new maps();
		
		let name: string = "";
		if (req.query.deg) {
			const deg: number = +req.query.deg
			if (!Number.isNaN(deg)) {
				name = oMaps.deg2Name(deg);
			}
		}
		
		const data: {} = {
			status : true
			, name : name
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