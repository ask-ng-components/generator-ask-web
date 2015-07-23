'use strict';
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  initializing: function () {
    // Grab and use config from yo-rc.json
    this.props =  this.config.get('props');
    this.appName = this.config.get('appName');
    this.imageMin = this.config.get('imageMin');
    this.processedFileExtension = this.config.get('processedFileExtension');
    this.watchTaskDeps = this.config.get('watchTaskDeps');
    this.wiredepExclusions =  this.config.get('wiredepExclusions');
    this.qrCode = false;

  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this
    );
  }
});
