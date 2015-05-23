// source: https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
var browserify = require('browserify')
var gulp = require('gulp')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var assign = require('lodash.assign')
var livereload = require('gulp-livereload')
var hbsify = require('hbsify')
var stringify = require('stringify')    

// browserify options
var customOpts = {
    entries: ['./assets/js/app.js'],
    debug: true,
    transform: [
      stringify({ extensions: ['.mst','.mustache'], minify: true })
    ],

    // require(/path/to/file.js) directly from those paths
    paths: [
        './node_modules',
        './assets/js/',
        './assets/js/lib/',
        './assets/js/modules/',
        './assets/js/views/',
        './templates/'
    ]
}

var opts = assign({}, watchify.args, customOpts)
var b = browserify(opts)
var w = watchify(b)

gulp.task('js', bundle) // so you can run `gulp js` to build the file
w.on('update', bundle) // on any dep update, runs the bundler
w.on('log', gutil.log) // output build logs to terminal

function bundle() {
    return b.bundle()

    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.', {sourceRoot: '/assets/js'})) 
    .pipe(gulp.dest('./assets/js'))
    .pipe(livereload({start: true}))
}


var cssnext = require('gulp-cssnext')
var rename = require('gulp-rename')
gulp.task('css', function() {
	gulp.watch('./assets/css/*.css', function() {
	  gulp.src("./assets/css/style.css")
	    .pipe(cssnext({
	        compress: true
	    }))
	    .pipe(rename('style.min.css'))
	    .pipe(gulp.dest('./assets/css'))
	})
})


gulp.task('default', ['js', 'css'])
