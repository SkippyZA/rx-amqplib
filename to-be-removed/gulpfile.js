'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var del = require('del');
var Config = require('./gulpfile.config');
var tsProject = tsc.createProject('tsconfig.json');

var config = new Config();

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
  return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
  var sourceTsFiles = [
    config.allTypeScript, // path to typescript files
    config.libraryTypeScriptDefinitions // reference to library .d.ts files
  ];

  var tsResult = gulp.src(sourceTsFiles)
    .pipe(tsc(tsProject));

  tsResult.dts.pipe(gulp.dest(config.tsOutputPath));

  return tsResult.js
    .pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
  var typeScriptGenFiles = [
    config.tsOutputPath +'/**/*.js', // path to all JS files auto gen'd by editor
    '!' + config.tsOutputPath + '/lib'
  ];

  // delete the files
  del(typeScriptGenFiles, cb);
});

gulp.task('watch', function() {
  gulp.watch([config.allTypeScript], ['ts-lint', 'compile-ts']);
});

gulp.task('default', ['ts-lint', 'compile-ts']);