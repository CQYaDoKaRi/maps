const path = require("path");

module.exports = {
	mode: "production"
	, entry: "./dist/public.babel/view/index.js"
	, output:
	{
		path: path.join(__dirname, "./public/js")
		, filename: "index.min.js"
	}
	, performance: {
		maxEntrypointSize: 500000
		, maxAssetSize: 500000
	}
}