'use strict';

var path = require('path');
var conf = require('./conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  return wiredep(wiredepOptions).js
    .concat([
<% if (props.jsPreprocessor.key === 'none') { -%>
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
<% } else { -%>
      path.join(conf.paths.tmp, '/serve/app/index.module.js'),
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
<% } -%>
      path.join(conf.paths.src, '/**/*.html')
    ]);
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    ngHtml2JsPreprocessor: {
      stripPrefix: conf.paths.src + '/',
      moduleName: '<%- props.appName %>'
    },

    logLevel: 'WARN',

<% if (props.jsPreprocessor.key === 'none') { -%>
    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src/**/!(*.spec).js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
<% } else { -%>
    frameworks: ['jasmine'],

    reporters: ['progress'],
<% } -%>

<% if(props.jsPreprocessor.key === 'traceur') { -%>
    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
<% } else { -%>
    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
<% } if (props.jsPreprocessor.key === 'none') { -%>
      'karma-angular-filesort',
      'karma-coverage',
<% } -%>
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ]
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
