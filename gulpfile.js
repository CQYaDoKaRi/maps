const gulp = require("gulp");
const path = require("path");
const del = require("del");
const concat = require("gulp-concat");

// ts
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const tsProjectNode = ts.createProject("tsconfig.node.json");

// babel
const babel = require("gulp-babel");

// webpack
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config");

// js - minify
const uglify = require("gulp-uglify");

// css(scss, sass)
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");

 // src
const app = require("./dist/public/ts/app");
const oApp = new app.app();
oApp.include();

// 環境設定
const env = {
	root: "./"
	, rootPublic: "./public"
 	, babel : {
		path: "./dist/public.babel"
		, src: [
			"./dist/public/**/*.js"
		]
	}
	, webpack : {
		src: "./dist/public.babel/view/index.js"
		, dist: {
			path: path.join(__dirname, "./public/js")
			, fname: "index.min.js"
			, fnameDev: "index.js"
		}
	}
	, js: {
		path: "./public/js"
		, srcApp: ["./dist/public.babel/ts/app.js"]
		, srcIndex: oApp.getJs()
		, srcLib: oApp.getJsLib()
		, minApp: "app.min.js"
		, minIndex: "index.min.js"
		, uglify: {
		}
	}
	, css: {
		path: "./public/css"
		, src: [
			"./src/scss/*.scss"
		]
		, srcIndex: oApp.getCss()
		, srcLib: oApp.getCssLib()
		, minIndex: "index.min.css"
	}
}

// typescript - comple
function tsc() {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest(tsProject.options.outDir))
	;
}

// typescript - comple - for node
function tscNode() {
	return tsProjectNode.src()
		.pipe(tsProjectNode())
		.js.pipe(gulp.dest(tsProjectNode.options.outDir))
	;
}

// js(6) - js(5)
function jsBabel(){
	return (
		gulp
		.src(env.babel.src)
		.pipe(
			babel(
				{
					presets: ["@babel/preset-env"]
				}
			)
		)
		.pipe(gulp.dest(env.babel.path))
	);
}

// js - webpack - prod - minify
function jsWebpack() {
	return webpackStream(webpackConfig, webpack)
	.pipe(gulp.dest(env.js.path)
	);
}

// js - webpack - dev
function jsWebpackDev() {
	webpackConfig.mode = "development";
	webpackConfig.output.filename = webpackConfig.output.filename.replace(".min", "");
	return webpackStream(webpackConfig, webpack)
	.pipe(gulp.dest(env.js.path)
	);
}

// JavaScript - app - minify
function jsAppMinify() {
	del("./" + env.js.path + "/" + env.js.minApp);

	return gulp
		.src(env.js.srcApp)
		.pipe(uglify(env.js.uglify))
		.pipe(concat(env.js.minApp))
		.pipe(gulp.dest(env.js.path))
	;
}

// scss - comple
function scss() {
	return gulp
		.src(env.css.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(env.css.path))
	;
}

// scss - minify
function scssMinify() {
	let src = env.css.srcIndex.map(
		(css) => {
			return env.rootPublic + "/" + css;
		}
	);

	return gulp
		.src(src)
		.pipe(sass({ outputStyle: "compact" }).on("error", sass.logError))
		.pipe(concat(env.css.minIndex))
		.pipe(gulp.dest(env.css.path))
	;
}

// scss - Lib - minify
function scssLibMinify() {
	let src = env.css.srcLib.map(
		(css) => {
			return env.rootPublic + "/" + css;
		}
	);
	src.push("./" + env.css.path + "/" + env.css.minIndex);

	return gulp
		.src(src)
		.pipe(concat(env.css.minIndex))
		.pipe(gulp.dest(env.css.path))
	;
}

// task - typescript
gulp.task("tsc", gulp.series(tsc, tscNode));
// task - babel
gulp.task("babel", gulp.series(jsBabel));
// task - webpack
gulp.task("webpack", gulp.series(jsWebpack, jsWebpackDev));
// task - javascript - minify
gulp.task("js-app", gulp.series(jsAppMinify));
// task - css
gulp.task("scss", gulp.series(scss));
// task - css - minify
gulp.task("cssmin", gulp.series(scssMinify, scssLibMinify));
// task - build
gulp.task("build"
	, gulp.series(
		tsc, jsBabel, jsWebpack, jsWebpackDev
		, tscNode
		, jsAppMinify
		, scss, scssMinify, scssLibMinify
	)
);

// task - watch - babel
const watchFiles = () => {
	gulp.watch(tsProject.options.outDir).on("change", gulp.series(jsBabel));
	gulp.watch(env.babel.path).on("change", gulp.series(jsWebpackDev));
	gulp.watch(env.css.src).on("change", gulp.series(scss, scssMinify, scssLibMinify));
};

gulp.task("watch", gulp.parallel(watchFiles));