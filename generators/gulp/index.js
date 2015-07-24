'use strict';
var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  initializing: function () {
    // Grab and use config from yo-rc.json
    this.props =  this.config.get('props');
    this.imageMin = this.config.get('imageMin');
    this.qrCode = false;

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
      if (this.imageMin) {
        this.processedFileExtension = this.processedFileExtension.concat(['jpg', 'png', 'gif', 'svg']);
      }
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
      } else if (this.props.ui.key === 'foundation') {
        if(this.props.foundationComponents.key !== 'official') {
          this.wiredepExclusions.push('/foundation\\.js/');
        }
        if(this.props.cssPreprocessor.extension === 'scss') {
          this.wiredepExclusions.push('/foundation\\.css/');
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
  }
});
