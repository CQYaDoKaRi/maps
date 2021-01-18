const gulp = require("gulp");
const del = require("del");
const concat = require("gulp-concat");

// ts
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

// js - minify
const uglify = require("gulp-uglify");

 // src
const app = require("./public/js/app");
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
		, srcApp: "public/js/app.js"
		, srcIndex: oApp.getJs()
		, srcLib: oApp.getJsLib()
		, minApp: "app.min.js"
		, minIndex: "index.min.js"
		, uglify: {
		}
	}
}


let fTSC = false;
let fJsAppMinify = false;
let fJsIndexMinify = false;
let fJsLibMinify = false;

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

// task - typescript
gulp.task("tsc", gulp.series(tsc));
// task - javascript - minify
gulp.task("jsmin", gulp.series(jsAppMinify, jsIndexMinify, jsLibMinify));
// task - build
gulp.task("build", gulp.series(tsc, jsAppMinify, jsIndexMinify, jsLibMinify));