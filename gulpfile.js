const gulp = require("gulp");
const ts = require("gulp-typescript");

// ts
const tsProject = ts.createProject("tsconfig.json");

// 環境設定
const env = {
	root: "./"
 	, ts: {
		src: [
			"src/ts/**/*.ts"
		]
	}
	, js: {
		path: "public/js"
	}
}


let fTSC = false;

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

// task - typescript
gulp.task("tsc", gulp.series(tsc));
// task - build
gulp.task("build", gulp.series(tsc));