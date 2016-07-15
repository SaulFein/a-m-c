'use strict';

var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

var configureSetup  = {
  createModule: false,
  constants: {
    fstack: process.env.FILEPICKER,
  }
};

gulp.task('config', function() {
  gulp.src('config.json')
      .pipe(gulpNgConfig('app', configureSetup))
      .pipe(gulp.dest('app'));
});
