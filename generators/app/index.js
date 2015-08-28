'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('src-path',{
      type: String,
      defaults: 'src',
      desc: 'Change src path'
    });
    this.option('dist-path',{
      type: String,
      defaults: 'dist',
      desc: 'Change dist path'
    });
    this.option('e2e-path',{
      type: String,
      defaults: 'e2e',
      desc: 'Change e2e path'
    });
    this.option('tmp-path',{
      type: String,
      defaults: '.tmp',
      desc: 'Change tmp path'
    });

    this.option('qrcode',{
      type: Boolean,
      defaults: false,
      desc: 'Displays QR Code pointing to the app when being served'
    });

  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the smashing ' + chalk.red('AskWeb') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Enter a name for the project:',
      default: _.kebabCase(path.basename(process.cwd())),
      filter: _.kebabCase,
      validate: function (input) {
        return input.length ? true : false;
      }
    },{
      type: 'list',
      name: 'projectType',
      message: 'What kind of project do you want?',
      choices: [{
        name: 'Promo website',
        value: 'promo'
      },{
        name: 'Ask-CS application',
        value: 'askApp'
      }]
    },{
      type: 'list',
      name: 'bootstrapComponents',
      message: 'How do you want to implement your Bootstrap components?',
      default: 1,
      choices: [{
      //   value: {
      //     key: 'ui-bootstrap',
      //     module: 'ui.bootstrap'
      //   },
      //   name: 'Angular UI Bootstrap, Bootstrap components written in pure AngularJS by the AngularUI Team'
      // },{
        value: {
          key: 'angular-strap',
          module: 'mgcrea.ngStrap'
        },
        name: 'AngularStrap, AngularJS 1.2+ native directives for Bootstrap 3'
      },{
        value: {
          key: 'official',
          module: null
        },
        name: 'The official jQuery implementation of Bootstrap'
      },{
        value: {
          key: 'none',
          module: null
        },
        name: 'No JavaScript, just CSS'
      }],
      when: function(answers){
        return (answers.projectType === 'askApp');
      }
    },{
      type: 'checkbox',
      name: 'angularModules',
      message: 'What Angular modules would you like to have? (ngRoute and ngResource will be addressed after)',
      choices: [
        {
          value: {
            key: 'animate',
            module: 'ngAnimate'
          },
          name: 'angular-animate.js (enable animation features)',
          checked: true
        },
        {
          value: {
            key: 'cookies',
            module: 'ngCookies'
          },
          name: 'angular-cookies.js (handle cookie management)',
          checked: true
        },
        {
          value: {
            key: 'touch',
            module: 'ngTouch'
          },
          name: 'angular-touch.js (for mobile development)',
          checked: true
        },
        {
          value: {
            key: 'sanitize',
            module: 'ngSanitize'
          },
          name: 'angular-sanitize.js (to securely parse and manipulate HTML)',
          checked: true
        }
      ],
      when: function(answers){
        return answers.projectType === 'askApp';
      }
    // },{
    //   type: 'list',
    //   name: 'jsPreprocessor',
    //   message: 'Which JS preprocessor do you want to use?',
    //   choices: [{
    //     name: 'None, use regular JavaScript (ES5)',
    //     value: {
    //       key: 'none',
    //       extension: 'js',
    //       srcExtension: 'js'
    //     }
    //   },{
    //     name: 'ES6 (ES2015), compiled with Babel',
    //     value: {
    //       key: 'babel',
    //       extension: 'js',
    //       srcExtension: 'es6'
    //     }
    //   },{
    //     name: 'TypeScript',
    //     value: {
    //       key: 'typescript',
    //       extension: 'ts',
    //       srcExtension: 'ts'
    //     }
    //   }],
    //   when: function(answers){
    //     return answers.projectType === 'askApp';
    //   }
    },{
      type: 'list',
      name: 'htmlPreprocessor',
      message: 'Which HTML preprocessor do you want to use?',
      choices: [{
        name: 'None, use regular HTML',
        value: {
          key: 'none',
          extension: 'html'
        }
      },{
        name: 'Jade',
        value: {
          key: 'jade',
          extension: 'jade'
        }
      }]
    }];

    this.prompt(prompts, function (props) {
      // Add some props for scaffolding
      //TODO: These should be temporary, clean up
      props.ui = {
        key: 'bootstrap',
        module: null
      };
      props.resource = {
        key: 'angular-resource',
        module: 'ngResource'
      };
      props.router = {
        key: 'angular-route',
        module: 'ngRoute'
      };
      props.jQuery = {
        key: 'jquery2'
      };
      props.cssPreprocessor = {
        key: 'node-sass',
        extension: 'scss'
      };
      props.jsPreprocessor = {
        key: 'none',
        extension: 'js',
        srcExtension: 'js'
      };
      props.angularVersion = '~1.4.4';

      if (props.projectType !== 'askApp') {
        props.bootstrapComponents = {
          key: 'official',
          module: null
        };
        props.angularModules = [{
          key: 'animate',
          module: 'ngAnimate'
        },{
          key: 'cookies',
          module: 'ngCookies'
        },{
          key: 'touch',
          module: 'ngTouch'
        },{
          key: 'sanitize',
          module: 'ngSanitize'
        }];
        // props.jsPreprocessor = {
        //   key: 'none',
        //   extension: 'js',
        //   srcExtension: 'js'
        // };
      }

      props.paths = {
        src: this.options['src-path'],
        dist: this.options['dist-path'],
        e2e: this.options['e2e-path'],
        tmp: this.options['tmp-path']
      };

      props.qrCode = this.options.qrcode;
      props.includeModernizr = false; // turn this into an option when needed

      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  }, // end prompting

  configuring: {

    addDerivedProps: function () {
      this.props.computedPaths = {
        appToBower: path.relative(this.props.paths.src, '')
      };

      this.props.appName = _.camelCase(this.props.name);
      // body...
    },

    saveProps: function () {
      this.config.set('props', this.props);
    },

    /**
     * Prepare all files from files.json and add them to `this.files` as
     * copy description object
     */
    prepareFiles: function () {

      var files = require('./files.json');

      /**
       * Take a template file path and create a copy description object
       * Add an _ to the file's basename if it's a template
       * Look for the js preprocessor equivalent file and use it if exist
       */
      function resolvePaths(template) {
        return function(file) {
          var src = file, dest = file;

          if(template) {
            var basename = path.basename(file);
            src = file.replace(basename, '_' + basename);
          }

          if(src.match(/\.js$/)) {
            var preprocessorFile = this.sourceRoot() + '/' + src.replace(/\.js$/, '.' + this.props.jsPreprocessor.srcExtension);
            if(this.fs.exists(preprocessorFile)) {
              src = src.replace(/\.js$/, '.' + this.props.jsPreprocessor.srcExtension);
              dest = dest.replace(/\.js$/, '.' + this.props.jsPreprocessor.extension);
            }
          }

          return {
            src: src,
            dest: dest,
            template: template
          };
        };
      }

      this.files = []
        .concat(files.staticFiles.map(resolvePaths(false), this))
        .concat(files.templates.map(resolvePaths(true), this));

    },

    /**
     * Compute Angular's module to load and format the dependency list to insert
     */
    computeModules: function () {
      var ngModules = this.props.angularModules.map(function (module) {
        return module.module;
      });

      ngModules = ngModules.concat([
        this.props.resource.module,
        this.props.router.module,
        this.props.ui.module,
        this.props.bootstrapComponents.module
      ]);

      ngModules = ngModules.concat([
        'pascalprecht.translate', // angular-translate
        'tmh.dynamicLocale' // angular-dynamic-locale
      ]);

      if(this.props.projectType === 'askApp') {
        ngModules = ngModules.concat([
          'ask.component.login'
        ]);
      }

      this.modulesDependencies = ngModules
        .filter(_.isString)
        .map(function (dependency) {
          return '\'' + dependency + '\'';
        })
        .join(', ');
    },

    /**
     * Simplify the model to simplify access to angular modules from the templates
     */
    prepareAngularModules: function () {
      this.angularModulesObject = {};

      this.props.angularModules.forEach(function (module) {
        this[module.key] = module.module;
      }, this.angularModulesObject);
    },

    /**
     * Add files of the navbar and the main view depending on the ui framework
     * and the css preprocessor
     */
    uiFiles: function () {
      this.files.push({
        src: 'src/app/components/navbar/__' + this.props.ui.key + '-navbar.' + this.props.htmlPreprocessor.extension,
        dest: 'src/app/components/navbar/navbar.' + this.props.htmlPreprocessor.extension,
        template: false
      });

      if(this.props.router.module !== null) {
        this.files.push({
          src: 'src/app/main/__' + this.props.ui.key + '.' + this.props.htmlPreprocessor.extension,
          dest: 'src/app/main/main.' + this.props.htmlPreprocessor.extension,
          template: true
        });
      }

      this.files.push({
        src: 'src/app/_' + this.props.ui.key + '/__' + this.props.ui.key + '-index.' + this.props.cssPreprocessor.extension,
        dest: 'src/app/index.' + this.props.cssPreprocessor.extension,
        template: true
      });

      this.files.push({
        src: 'src/app/components/malarkey/__malarkey.' + this.props.cssPreprocessor.extension,
        dest: 'src/app/components/malarkey/malarkey.' + this.props.cssPreprocessor.extension,
        template: false
      });

      this.files.push({
        src: 'src/app/components/navbar/__navbar.' + this.props.cssPreprocessor.extension,
        dest: 'src/app/components/navbar/navbar.' + this.props.cssPreprocessor.extension,
        template: false
      });
    },

    computeRouter: function () {
      var routerPartialSrc = 'src/app/main/__' + this.props.ui.key + '.html';

      if (this.props.router.module === 'ngRoute') {
        this.routerHtml = '<div ng-view></div>';
        this.files.push({
          src: 'src/app/_ngroute/__ngroute.' + this.props.jsPreprocessor.srcExtension,
          dest: 'src/app/index.route.' + this.props.jsPreprocessor.extension,
          template: true
        });
      } else if (this.props.router.module === 'ui.router') {
        this.routerHtml = '<div ui-view></div>';
        this.files.push({
          src: 'src/app/_uirouter/__uirouter.' + this.props.jsPreprocessor.srcExtension,
          dest: 'src/app/index.route.' + this.props.jsPreprocessor.extension,
          template: true
        });
      } else {
        this.routerHtml = this.fs.read(this.templatePath(routerPartialSrc));
        this.routerHtml = this.routerHtml.replace(
          /^<div ([^>]*)>/,
          '<div $1 ng-controller="MainController as main">'
        );

        this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
      }
    },

    /**
     * Reject files from files.json
     * Some important files are listed in the files.json even if they are not needed
     * depending on options. This step reject these files.
     */
    rejectFiles: function () {
      function rejectWithRegexp(regexp) {
        /* jshint -W040 */
        this.files = _.reject(this.files, function(file) {
          return regexp.test(file.src);
        });
        /* jshint +W040 */
      }

      if(this.props.projectType !== 'askApp') {
        rejectWithRegexp.call(this, /login/);
        rejectWithRegexp.call(this, /navbarService/);
      }

      if(this.props.cssPreprocessor.key === 'none') {
        rejectWithRegexp.call(this, /styles\.js/);
      }

      if(this.props.jsPreprocessor.key !== 'typescript') {
        rejectWithRegexp.call(this, /tsd\.js/);
        rejectWithRegexp.call(this, /tsd\.json/);
      }

      if(this.props.jsPreprocessor.srcExtension === 'es6' || this.props.jsPreprocessor.key === 'typescript') {
        rejectWithRegexp.call(this, /index\.constants\.js/);
      }

      if(this.props.jsPreprocessor.key !== 'none') {
        rejectWithRegexp.call(this, /spec\.js/);
      }
    },

    /**
     * Copy additional lint files if needed
     */
    lintCopies: function () {
      if(this.props.jsPreprocessor.key === 'typescript') {
        this.files.push({
          src: 'tslint.json',
          dest: 'tslint.json',
          template: false
        });
      }
    },

    /**
     * Copy additional files for Travis
     */
    travisCopies: function () {
      if(process.env.TRAVIS === 'true') {

        // Avoid rate limit by GithubAPI
        if(this.props.jsPreprocessor.key === 'typescript') {

          this.files.push({
            src: '.tsdrc',
            dest: '.tsdrc',
            template: false
          });
        }
      }
    },

    prepareBowerOverrides: function () {

      var bowerOverrides = {};

      if (this.props.ui.key === 'bootstrap') {

        if (this.props.cssPreprocessor.extension === 'scss') {

          bowerOverrides['bootstrap-sass-official'] = {
            main: [
              'assets/stylesheets/_bootstrap.scss',
              'assets/fonts/bootstrap/glyphicons-halflings-regular.eot',
              'assets/fonts/bootstrap/glyphicons-halflings-regular.svg',
              'assets/fonts/bootstrap/glyphicons-halflings-regular.ttf',
              'assets/fonts/bootstrap/glyphicons-halflings-regular.woff',
              'assets/fonts/bootstrap/glyphicons-halflings-regular.woff2'
            ]
          };

          if (this.props.bootstrapComponents.key === 'official') {
            bowerOverrides['bootstrap-sass-official'].main.unshift('assets/javascripts/bootstrap.js');
          }

        } else {

          bowerOverrides.bootstrap = {
            main: [
              'dist/fonts/glyphicons-halflings-regular.eot',
              'dist/fonts/glyphicons-halflings-regular.svg',
              'dist/fonts/glyphicons-halflings-regular.ttf',
              'dist/fonts/glyphicons-halflings-regular.woff',
              'dist/fonts/glyphicons-halflings-regular.woff2'
            ]
          };

          if (this.props.bootstrapComponents.key === 'official') {
            bowerOverrides.bootstrap.main.unshift('dist/js/bootstrap.js');
          }

        }

        if (this.props.cssPreprocessor.key === 'none') {
          bowerOverrides.bootstrap.main.unshift('dist/css/bootstrap.css');
        }

        if (this.props.cssPreprocessor.key === 'less') {
          bowerOverrides.bootstrap.main.unshift('less/bootstrap.less');
        }
      }

      if (_.isEmpty(bowerOverrides)) {
        this.bowerOverrides = null;
      } else {
        this.bowerOverrides = JSON.stringify(bowerOverrides, null, 2)
          .replace(/\n/g, '\n  ');
      }

    }

  }, // end configuring

  writing: {
    /**
     * Pass through each files and actually copy them
     */
    writeFiles: function () {
      function replacePrefix(filePath, folderPairs) {
        var bestMatch = '';

        _.forEach(folderPairs, function(destFolder, sourceFolder) {
          if (filePath.indexOf(sourceFolder) === 0 && sourceFolder.length > bestMatch.length) {
            bestMatch = sourceFolder;
          }
        });

        if (bestMatch.length) {
          return filePath.replace(bestMatch, folderPairs[bestMatch]);
        }
        else {
          return filePath;
        }
      }


      this.files.forEach(function(file) {
        var dest = replacePrefix(file.dest, this.props.paths);
        try {
          if(file.template) {
            this.fs.copyTpl(this.templatePath(file.src), this.destinationPath(dest), this);
          } else {
            this.fs.copy(this.templatePath(file.src), this.destinationPath(dest));
          }
        } catch (error) {
          console.error('Template processing error on file', file.src);
          throw error;
        }
      }, this);
    }
  }, // end writing

  default: function () {

    this.composeWith('ask-web:gulp', {}, {
      local: require.resolve('../gulp')
    });
  }, // end default

  install: function () {
    this.installDependencies();
  }
});
