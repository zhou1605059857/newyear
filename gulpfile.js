/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-01-01 18:36:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-01 19:38:19
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean-css');

gulp.task('sass', function() {
    return gulp.src('./src/sass/*.scss').pipe(sass()).pipe(gulp.dest('./src/css'));
});

gulp.task('watch', function() {
    return gulp.watch('./src/sass/*.scss', gulp.series('sass'));
});

gulp.task('clean', function() {
    return gulp.src('./src/css/*.css').pipe(clean()).pipe(gulp.dest('./build/css'));
});

gulp.task('uglify', function() {
    return gulp.src('./src/js/*.js').pipe(uglify()).pipe(gulp.dest('./build/js'));
});

gulp.task('htmlmin', function() {
    return gulp.src('./src/*.html').pipe(htmlmin()).pipe(gulp.dest('./build'));
});

gulp.task('imagemin', function() {
    return gulp.src('./src/images/*.{jpg,png,jpeg,gif}').pipe(imagemin()).pipe(gulp.dest('./build/images'));
});

gulp.task('webserver', function() {
    return gulp.src('./src').pipe(webserver({
        port: 8989,
        open: true,
        middleware: function(req, res) {
            var pathname = require('url').parse(req.url).pathname;
            if (pathname === '/favicon.ico') {
                return res.end('');
            };
            pathname = pathname === '/' ? 'index.html' : pathname;
            if (pathname === 'index.html') {
                res.end(require('fs').readFileSync(require('path').join(__dirname, 'src/index.html')));
            } else {
                res.end(require('fs').readFileSync(require('path').join(__dirname, 'src', pathname)));
            }
        }
    }))
});

gulp.task('add', gulp.series('sass', 'clean', 'uglify', 'htmlmin', 'imagemin', 'webserver', 'watch'));