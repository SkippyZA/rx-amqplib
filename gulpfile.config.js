'use strict';

var GulpConfig = (function () {
  function gulpConfig() {
    //Got tired of scrolling through all the comments so removed them
    //Don't hurt me AC :-)
    this.source = './src/';
    this.dest = './build/';

    this.tsOutputPath = this.dest + '/js';
    this.allTypeScript = this.source + '/**/*.ts';

    this.typings = './typings/';
    this.libraryTypeScriptDefinitions = this.typings + '/**/*.ts';
  }
  return gulpConfig;
})();
module.exports = GulpConfig;