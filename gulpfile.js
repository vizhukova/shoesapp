var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var browserify = require("browserify");
var source = require('vinyl-source-stream');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/src/**/*.js']

};

gulp.task('default', ['sass', 'watch']);

gulp.task('build', function () {
  return browserify({entries: [
    "./www/src/app.js",
    "./www/src/controllers.js",
    "./www/src/services.js",
    "./www/src/config.js",
    "./www/src/directives.js"
  ],debug: true})
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./www/js'));
});

gulp.task('sass', function(done) {
  gulp.src(['./scss/ionic.app.scss', './scss/style.scss'])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['build'], function() {
  gulp.watch('www/src/**/*.js', ['build']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
