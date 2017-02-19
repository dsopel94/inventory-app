// Load plugins
var gulp = require('gulp'),
    server = require('gulp-server-livereload');

// Server
gulp.task('default', function() {
  gulp.src('./public/')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 8080
    }));
});
