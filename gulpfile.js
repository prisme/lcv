// source: https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md

var browserify = require('browserify');
var gulp = require('gulp');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var livereload = require('gulp-livereload');
var hbsify = require('hbsify');

// custom browserify options
var customOpts = {
    entries: ['./assets/js/app.js'],
    debug: true,
    transform: ['hbsify'],

    // require(/path/to/file.js) directly from those paths
    paths: [
        './node_modules',
        './assets/js/',
        './assets/js/lib/',
        './assets/js/modules/',
        './assets/js/views/',
        './templates/'
    ]
};

var opts = assign({}, watchify.args, customOpts);
var b = browserify(opts);
var w = watchify(b);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
w.on('update', bundle); // on any dep update, runs the bundler
w.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()

    // log errors
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))

    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())

    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./assets/js'))
    .pipe(livereload({start: true}));
}

gulp.task('default', ['js']);
