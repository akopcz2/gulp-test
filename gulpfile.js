// grab our packages
var gulp   = require('gulp'),
	gutil = require('gulp-util')

    jshint = require('gulp-jshint');
    sourcemaps = require('gulp-sourcemaps');
    concat = require('gulp-concat');
    open = require('gulp-open');
    nodemon = require('gulp-nodemon');
    browserSync = require('browser-sync').create();
	sass = require('gulp-ruby-sass');
	rename = require('gulp-rename');

// define the default task and add the watch task to it

//build the css
gulp.task('build-css', function() {
    return gulp.src('./source/scss/css.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/assets/stylesheets/'));
});

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 3002}));
  app.use(express.static(__dirname));
  app.listen(3002);
});

//starts a node server from server.js
gulp.task('start', function () {
	nodemon({
	script: 'server.js'
	, ext: 'js html'
	, env: { 'NODE_ENV': 'development' }
	});
	// browserSync.init({
	//     server: {
	//         baseDir: "./"
	//     }
	// });
    var options = {
    url: 'http://localhost:3000',
    app: 'google chrome'
  };
  gulp.src('./public/index.html')
  .pipe(open('', options));
})

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
  gulp.watch('source/scss/css.scss', ['build-css']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
});

//build the js and bundle it together
gulp.task('build-js', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'));
});


gulp.task('default', ['express', 'livereload', 'watch' , 'start' ,'build-css'], function() {

});