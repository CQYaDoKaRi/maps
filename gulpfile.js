const gulp = require("gulp");
const del = require("del");
const concat = require("gulp-concat");

// ts
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

// js - minify
const uglify = require("gulp-uglify");

// css(scss, sass)
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");

 // src
const app = require("./public/js/ts/app");
const oApp = new app.app();
oApp.include();

// 環境設定
const env = {
	root: "./"
	, rootPublic: "./public"
 	, ts: {
		src: [
			"src/ts/**/*.ts"
		]
	}
	, js: {
		path: "public/js"
		, srcApp: ["public/js/ts/app.js"]
		, srcIndex: oApp.getJs()
		, srcLib: oApp.getJsLib()
		, minApp: "app.min.js"
		, minIndex: "index.min.js"
		, uglify: {
		}
	}
	, css: {
		path: "public/css"
		, src: [
			"src/scss/**/*.scss"
		]
		, srcIndex: oApp.getCss()
		, srcLib: oApp.getCssLib()
		, minIndex: "index.min.css"
	}
}


let fTSC = false;
let fJsAppMinify = false;
let fJsIndexMinify = false;
let fJsLibMinify = false;
let fScss = false;
let fScssMinify = false;
let fScssLibMinify = false;

// typescript - comple
function tsc() {
	if (!fTSC) {
		console.log("tsc", env.ts.src);
		fTSC = true;
	}

	return tsProject.src()
		.pipe(tsProject())
		.js
 		.pipe(gulp.dest(env.js.path))
	;
}

// JavaScript - app - minify
function jsAppMinify() {
	del("./" + env.js.path + "/" + env.js.minApp);

	if (!fJsAppMinify) {
		console.log("js-app-minify", env.js.srcApp);
		fJsAppMinify = true;
	}

	return gulp
		.src(env.js.srcApp)
		.pipe(uglify(env.js.uglify))
		.pipe(concat(env.js.minApp))
		.pipe(gulp.dest(env.js.path))
	;
}


// JavaScript - index - minify
function jsIndexMinify() {
	del("./" + env.js.path + "/" + env.js.minIndex);

	let src = env.js.srcIndex.map(
		(js) => {
			return env.rootPublic + "/" + js;
		}
	);

	if (!fJsIndexMinify) {
		console.log("js-index-minify", src);
		fJsIndexMinify = true;
	}

	return gulp
		.src(src)
		.pipe(uglify(env.js.uglify))
		.pipe(concat(env.js.minIndex))
		.pipe(gulp.dest(env.js.path))
	;
}

// JavaScript - lib - minify(concat)
function jsLibMinify() {
	let src = env.js.srcLib.map(
		(js) => {
			return env.rootPublic + "/" + js;
		}
	);
	src.push("./" + env.js.path + "/" + env.js.minIndex);

	if (!fJsLibMinify) {
		console.log("js-lib-minify", src);
		fJsLibMinify = true;
	}

	return gulp
		.src(src)
		.pipe(concat(env.js.minIndex))
		.pipe(gulp.dest(env.js.path))
	;
}

// scss - comple
function scss() {
	if (!fScss) {
		console.log("scss", env.css.src);
		fScss = true;
	}

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
	if (!fScssMinify) {
		console.log("scss-minify", env.css.srcIndex);
		fScssMinify = true;
	}

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
	if (!fScssLibMinify) {
		console.log("scss-lib-minify", env.css.srcLib);
		fScssLibMinify = true;
	}

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
gulp.task("tsc", gulp.series(tsc));
// task - javascript - minify
gulp.task("jsmin", gulp.series(jsAppMinify, jsIndexMinify, jsLibMinify));
gulp.task("jsmin-app", gulp.series(jsAppMinify));
// task - css
gulp.task("scss", gulp.series(scss));
// task - css - minify
gulp.task("cssmin", gulp.series(scssMinify, scssLibMinify));
// task - build
gulp.task("build", gulp.series(tsc, jsAppMinify, jsIndexMinify, jsLibMinify, scss, scssMinify, scssLibMinify));