import express from 'express';

export class page {
	private uri = '';

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string){
		this.uri = uri;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		router.get(this.uri,
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
	}
}