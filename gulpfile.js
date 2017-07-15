var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	minifyHtml = require('gulp-minify-html'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat');

// gulp.task('jsLint',function(){
// 	gulp.src('src/js/*.js')
// 		.pipe(jshint())
// 		.pipe(gulp.reporter());
// });

gulp.task('uglify',function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('concat',function(){
	return gulp.src('dist/js/*.js')
		.pipe(concat('all.js'))
		.pipe(rename('all.min.js'))
		.pipe(gulp.dest('dist/js'));
});


gulp.task('minify-css',function(){
	return gulp.src('src/css/*.css')
		.pipe(minifyCss())
		.pipe(rename('*.min.js'))
		.pipe(gulp.dest('dist/css'));
});


gulp.task('minify-html',function(){
	gulp.src('html/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist/html'));
});

