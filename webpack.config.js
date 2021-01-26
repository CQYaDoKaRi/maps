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
		maxEntrypointSize: 1000000
		, maxAssetSize: 1000000
	}
	, module: {
		rules: [
		  {
			test: /\.css$/i,
			use: [
				"style-loader"
				, {
					loader: "css-loader"
					, options: { url: false }
				}
			]
		  }
		]
	}
}