const gulp = require("gulp");
const path = require("path");
const del = require("del");
const concat = require("gulp-concat");

// prettier
const prettier = require("gulp-prettier");
const prettierConfig = require("./.prettierrc.js");

// eslint
const eslint = require("gulp-eslint");

// ts
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const tsProjectNode = ts.createProject("tsconfig.node.json");
const tsProjectLint = ts.createProject("tsconfig.eslint.json");

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

// 環境設定
const env = {
	root: "./",
	rootPublic: "./public",
	src: {
		dist: "./src",
	},
	json: {
		path: "./dist/public.babel/json",
		src: ["./dist/public/json/*.json"],
	},
	babel: {
		path: "./dist/public.babel",
		src: ["./dist/public/**/*.js", "./dist/public/**/*.jsx"],
	},
	webpack: {
		src: "./dist/public.babel/view/index.js",
		dist: {
			path: path.join(__dirname, "./public/js"),
			fname: "index.min.js",
			fnameDev: "index.js",
		},
	},
	js: {
		path: "./public/js",
		srcApp: ["./dist/public.babel/ts/app.js"],
		srcIndex: ["js/index.js"],
		srcLib: [],
		minApp: "app.min.js",
		minIndex: "index.min.js",
		uglify: {},
	},
	css: {
		path: "./public/css",
		src: ["./src/scss/*.scss"],
		srcIndex: ["css/index.css"],
		srcLib: ["css/font-awesome.css"],
		minIndex: "index.min.css",
	},
};

// prettier
const formatter = () => {
	return tsProjectLint.src().pipe(prettier(prettierConfig)).pipe(gulp.dest(env.src.dist));
};

// eslint
const linter = () => {
	return tsProjectLint
		.src()
		.pipe(
			eslint({
				useEslintrc: true,
			})
		)
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
};

// typescript - comple
const tsc = () => {
	return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(tsProject.options.outDir));
};

// typescript - comple - for node
const tscNode = () => {
	return tsProjectNode.src().pipe(tsProjectNode()).js.pipe(gulp.dest(tsProjectNode.options.outDir));
};

// json
const json = () => {
	return gulp
	.src(env.json.src)
	.pipe(gulp.dest(env.json.path));
};

// js(6) - js(5)
const jsBabel = () => {
	return gulp
		.src(env.babel.src)
		.pipe(
			babel({
				presets: ["@babel/preset-env","@babel/preset-react"],
			})
		)
		.pipe(gulp.dest(env.babel.path));
};

// js - webpack - prod - minify
const jsWebpack = () => {
	return webpackStream(webpackConfig, webpack).pipe(gulp.dest(env.js.path));
};

// js - webpack - dev
const jsWebpackDev = () => {
	webpackConfig.mode = "development";
	webpackConfig.output.filename = webpackConfig.output.filename.replace(".min", "");
	return webpackStream(webpackConfig, webpack).pipe(gulp.dest(env.js.path));
};

// JavaScript - app - minify
const jsAppMinify = () => {
	del("./" + env.js.path + "/" + env.js.minApp);

	return gulp.src(env.js.srcApp).pipe(uglify(env.js.uglify)).pipe(concat(env.js.minApp)).pipe(gulp.dest(env.js.path));
};

// scss - comple
const scss = () => {
	return gulp
		.src(env.css.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(env.css.path));
};

// scss - minify
const scssMinify = () => {
	let src = env.css.srcIndex.map((css) => {
		return env.rootPublic + "/" + css;
	});

	return gulp
		.src(src)
		.pipe(sass({ outputStyle: "compact" }).on("error", sass.logError))
		.pipe(concat(env.css.minIndex))
		.pipe(gulp.dest(env.css.path));
};

// scss - Lib - minify
const scssLibMinify = () => {
	let src = env.css.srcLib.map((css) => {
		return env.rootPublic + "/" + css;
	});
	src.push("./" + env.css.path + "/" + env.css.minIndex);

	return gulp.src(src).pipe(concat(env.css.minIndex)).pipe(gulp.dest(env.css.path));
};

// task - typescript
const task_tsc = gulp.parallel(tsc, tscNode);
exports.tsc = task_tsc;

// task - json
const task_json = gulp.series(json);
exports.json = task_json;

// task - babel
const task_babel = gulp.series(jsBabel);
exports.babel = task_babel;

// task - webpack
const task_webpack = gulp.parallel(jsWebpack, jsWebpackDev);
exports.webpack = task_webpack;

// task - javascript - minify
const task_jsApp = gulp.series(jsAppMinify);
exports.jsApp = task_jsApp;

// task - css
const task_scss = gulp.series(scss, scssMinify, scssLibMinify);
exports.scss = task_scss;

// task - build
const task_build = gulp.series(
	gulp.parallel(
		gulp.series(
			formatter,
			linter,
			gulp.parallel(tsc, tscNode),
			json,
			jsBabel,
			gulp.parallel(jsWebpack, jsWebpackDev),
			jsAppMinify
		),
		task_scss
	)
);
exports.build = task_build;

// task - watch - build
const watch_build = () => {
	// linter
	gulp.watch("./").on("change", gulp.series(linter));

	// tsc + babel
	// +
	// webpack, js-app
	gulp
		.watch(tsProject.config.include)
		.on("change", gulp.series(tsc, json, jsBabel, jsAppMinify, gulp.parallel(jsWebpack, jsWebpackDev)));

	// tsc for node
	gulp.watch(tsProjectNode.config.include).on("change", gulp.series(tscNode));

	// scss
	gulp.watch(env.css.src).on("change", task_scss);
};
exports.watch = watch_build;
