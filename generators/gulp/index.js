'use strict';
var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  initializing: function () {
    // Grab and use config from yo-rc.json
    this.props =  this.config.get('props');

  },

  configuring: {
    /**
     * List files extension processed by the generator
     */
    computeProcessedFileExtension: function () {
      this.processedFileExtension = [
        'html',
        'css',
        'js',
        this.props.cssPreprocessor.extension,
        this.props.jsPreprocessor.extension,
        this.props.htmlPreprocessor.extension
      ];
      // for imageMin
      this.processedFileExtension = this.processedFileExtension.concat(['jpg', 'png', 'gif', 'svg']);

      this.processedFileExtension = _.chain(this.processedFileExtension)
        .uniq()
        .filter(_.isString)
        .value()
        .join(',');
    },

    /**
     * Compute gulp inject task dependencies depending on js and css preprocessors
     */
    computeWatchTaskDeps: function () {

      this.watchTaskDeps = [];

      if (this.props.jsPreprocessor.srcExtension === 'es6') {
        this.watchTaskDeps.push('\'scripts:watch\'');
      }

      if (this.props.htmlPreprocessor.key !== 'none') {
        this.watchTaskDeps.push('\'markups\'');
      }

      this.watchTaskDeps.push('\'inject\'');
    },

    computeWiredepExclusions: function () {
      this.wiredepExclusions = [];
      if (this.props.jQuery.key === 'none') {
        this.wiredepExclusions.push('/jquery/');
      }
      if (this.props.ui.key === 'bootstrap') {
        if(this.props.bootstrapComponents.key !== 'official') {
          this.wiredepExclusions.push('/bootstrap\.js$/');
          if(this.props.cssPreprocessor.extension === 'scss') {
            this.wiredepExclusions.push('/bootstrap-sass-official\\/.*\\.js/');
          }
        }
        if(this.props.cssPreprocessor.key !== 'none') {
          this.wiredepExclusions.push('/bootstrap\\.css/');
        }
      }
    }
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('_conf.js'),
      this.destinationPath('conf.js'),
      this
    );
  }
});
