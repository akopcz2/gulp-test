// grab our packages
var gulp   = require('gulp'),
	gutil = require('gulp-util')

    jshint = require('gulp-jshint');
    sass   = require('gulp-sass');
    sourcemaps = require('gulp-sourcemaps');
    concat = require('gulp-concat');
    open = require('gulp-open');
    nodemon = require('gulp-nodemon');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

//build the css
gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
  	.pipe(sourcemaps.init())
	  .pipe(sass())
	.pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/stylesheets'));
});


//starts a node server from server.js
gulp.task('start', function () {
  nodemon({
    script: 'server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})

//open local url in port 3000
gulp.task('url', function(){
  var options = {
    url: 'http://localhost:3000',
    app: 'google chrome'
  };
  gulp.src('./index.html')
  .pipe(open('', options));
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
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