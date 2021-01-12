const express = require('express');
const app = express();

app.listen(8080);

app.get('/',
        (req, res) => {
			let html = [];

			html.push("<!DOCTYPE html>");
			html.push("<html>");
			html.push("<head>");

			html.push("<meta http-equiv=\"refresh\" content=\"0; URL=index.html\">");
			html.push("<title>maps</title>");

			html.push("</head>");
			html.push("<body>");
			html.push("</body>");
			html.push("</html>");

			res.send(html.join(""));
			res.end();
        }
);

app.use('/', express.static(__dirname + '/public'));