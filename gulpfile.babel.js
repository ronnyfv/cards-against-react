import gulp from "gulp";
import path from "path";

const $ = require("gulp-load-plugins")();

gulp.task('server:build', () => {
	const serverPath = './src/server/**/*.js';

	return gulp.src(serverPath)
		.pipe($.changed('./build/'))
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write('.', { sourceRoot: path.join(__dirname, 'src', 'server') }))
		.pipe(gulp.dest('./build/'));
});