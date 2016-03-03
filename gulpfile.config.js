'use strict';

var GulpConfig = (function () {
  function gulpConfig() {
    this.source = './src/';
    this.dest = './dist/';
    this.typings = './typings/';

    this.tsOutputPath = this.dest;
    this.allTypeScript = this.source + '/**/*.ts';
    this.libraryTypeScriptDefinitions = this.typings + '/**/*.ts';
  }
  return gulpConfig;
})();
module.exports = GulpConfig;