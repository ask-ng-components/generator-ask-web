'use strict';

var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var _ = require('lodash');

var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var conf = require('./conf');

/**
 * Adapted from generator-gulp-angular's _build.js
 */

<% if (props.htmlPreprocessor.key === 'none') { -%>
gulp.task('partials', function () {
<% } else { -%>
gulp.task('partials', ['markups'], function () {
<% } -%>
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: '<%- props.appName %>',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'scss') { -%>
    .pipe($.replace('../<%- props.computedPaths.appToBower %>/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'less') { -%>
    .pipe($.replace('../<%- props.computedPaths.appToBower %>/bower_components/bootstrap/fonts/', '../fonts/'))
<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'styl') { -%>
    .pipe($.replace('../<%- props.computedPaths.appToBower %>/bower_components/bootstrap-stylus/fonts/', '../fonts/'))
<% } -%>
    .pipe($.minifyCss({ processImport: false }))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(path.join(conf.paths.src, '/assets/images/**/*'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/images/')));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'styl') { -%>
  return gulp.src($.mainBowerFiles().concat('bower_components/bootstrap-stylus/fonts/*'))
<% } else { -%>
  return gulp.src($.mainBowerFiles())
<% } -%>
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('i18n', function () {
  return gulp.src([
    'bower_components/angular-i18n/angular-locale_en.js',
    'bower_components/angular-i18n/angular-locale_nl.js',
    'bower_components/angular-i18n/angular-locale_de.js'
  ])
  .pipe(gulp.dest(path.join(conf.paths.dist, '/angular/i18n/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{<%- processedFileExtension %>}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

<% if (props.jsPreprocessor.key === 'typescript') { -%>
gulp.task('clean', ['tsd:purge'], function (done) {
<% } else { -%>
gulp.task('clean', function (done) {
<% } -%>
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'i18n', 'other']);


/**
 * Adapted from generator-gulp-angular's _inject.js
 */

<% if (props.cssPreprocessor.key !== 'none') { -%>
gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });
<% } else { -%>
gulp.task('inject', ['scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });
<% } -%>

  var injectScripts = gulp.src([
<% if (props.jsPreprocessor.srcExtension === 'es6' || props.jsPreprocessor.srcExtension === 'ts') { -%>
    path.join(conf.paths.tmp, '/serve/app/**/*.module.js')
<% } -%>
<% if (props.jsPreprocessor.srcExtension === 'js' || props.jsPreprocessor.srcExtension === 'coffee') { -%>
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
<%   if (props.jsPreprocessor.srcExtension === 'coffee') { -%>
    path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
    path.join(conf.paths.tmp, '/serve/app/**/*.js'),
    path.join('!' + conf.paths.tmp, '/serve/app/**/*.spec.js'),
    path.join('!' + conf.paths.tmp, '/serve/app/**/*.mock.js')
<%   } -%>
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
<% } else {-%>
  ], { read: false });
<% } -%>

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});


/**
 * Adapted from generator-gulp-angular's _markups.js
 */


<% if (props.htmlPreprocessor.key !== 'none') {-%>
gulp.task('markups', function() {
  function renameToHtml(path) {
    path.extname = '.html';
  }

  return gulp.src(path.join(conf.paths.src, '/app/**/*.<%- props.htmlPreprocessor.extension %>'))
<%   if (props.htmlPreprocessor.key === 'jade') { -%>
    .pipe($.consolidate('jade', { basedir: conf.paths.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
<%   } else if (props.htmlPreprocessor.key === 'haml') { -%>
    .pipe($.consolidate('haml')).on('error', conf.errorHandler('Haml'))
<%   } else if (props.htmlPreprocessor.key === 'handlebars') { -%>
    .pipe($.consolidate('handlebars')).on('error', conf.errorHandler('Handlebars'))
<%   } -%>
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({ stream: true }));
});
<% } -%>


/**
 * Adapted from generator-gulp-angular's _scripts.js
 */

<% if (props.jsPreprocessor.srcExtension === 'es6') { -%>
var webpack = require('webpack-stream');
<% } -%>

<% if (props.jsPreprocessor.srcExtension !== 'es6') { -%>
<%   if (props.jsPreprocessor.key === 'typescript') { -%>
  var tsProject = $.typescript.createProject({
    target: 'es5',
    sortOutput: true
  });

  gulp.task('scripts', ['tsd:install'], function () {
<%   } else { -%>
gulp.task('scripts', function () {
<%   } -%>
  return gulp.src(path.join(conf.paths.src, '/app/**/*.<%- props.jsPreprocessor.extension %>'))
<%   if (props.jsPreprocessor.extension === 'js') { -%>
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
<%   } if (props.jsPreprocessor.key !== 'none') { -%>
    .pipe($.sourcemaps.init())
<%   } if (props.jsPreprocessor.key === 'coffee') { -%>
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffee()).on('error', conf.errorHandler('CoffeeScript'))
<%   } if (props.jsPreprocessor.key === 'typescript') { -%>
    .pipe($.tslint())
    .pipe($.tslint.report('prose', { emitError: false }))
    .pipe($.typescript(tsProject)).on('error', conf.errorHandler('TypeScript'))
    .pipe($.concat('index.module.js'))
<%   } if (props.jsPreprocessor.key !== 'none') { -%>
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')))
<%   } -%>
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
<% } else { -%>
function webpackWrapper(watch, callback) {
  var webpackOptions = {
    watch: watch,
    module: {
      preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}],
<%   if (props.jsPreprocessor.key === 'babel') { -%>
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
<%   } if (props.jsPreprocessor.key === 'traceur') { -%>
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'traceur-loader'}]
<%   } -%>
    },
    output: { filename: 'index.module.js' }
  };

  if(watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    $.util.log(stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  return gulp.src(path.join(conf.paths.src, '/app/index.module.js'))
    .pipe(webpack(webpackOptions, null, webpackChangeHandler))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts', function () {
  return webpackWrapper(false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
  return webpackWrapper(true, callback);
});
<% } -%>


/**
 * Adapted from generator-gulp-angular's _server.js
 */

var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');
<% if(props.qrCode) { -%>

var qrcode = require('qrcode-terminal');
<% } -%>

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line bellow.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
<% if(props.qrCode) { -%>
  }, function(err, bs) {
    qrcode.generate(bs.options.get('urls').get('external'));
  });
<% } else { -%>
  });
<% } -%>
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});


/**
 * Adapted from generator-gulp-angular's _styles.js
 */


gulp.task('styles', function () {
<% if (props.cssPreprocessor.key === 'less') { -%>
  var lessOptions = {
    options: [
      'bower_components',
      path.join(conf.paths.src, '/app')
    ]
  };
<% } if (props.cssPreprocessor.extension === 'scss') { -%>
  var sassOptions = {
    style: 'expanded'
  };
<% } -%>

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.<%- props.cssPreprocessor.extension %>'),
    path.join('!' + conf.paths.src, '/app/index.<%- props.cssPreprocessor.extension %>')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

<% if (props.cssPreprocessor.key === 'ruby-sass') { -%>
  var cssFilter = $.filter('**/*.css', { restore: true });
<% } -%>

  return gulp.src([
    path.join(conf.paths.src, '/app/index.<%- props.cssPreprocessor.extension %>')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
<% if (props.cssPreprocessor.key === 'ruby-sass') { -%>
    .pipe($.rubySass(sassOptions)).on('error', conf.errorHandler('RubySass'))
    .pipe(cssFilter)
    .pipe($.sourcemaps.init({ loadMaps: true }))
<% } else { -%>
    .pipe($.sourcemaps.init())
<% } if (props.cssPreprocessor.key === 'less') { -%>
    .pipe($.less(lessOptions)).on('error', conf.errorHandler('Less'))
<% } else if (props.cssPreprocessor.key === 'node-sass') { -%>
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
<% } else if (props.cssPreprocessor.key === 'stylus') { -%>
    .pipe($.stylus()).on('error', conf.errorHandler('Stylus'))
<% } -%>
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
<% if (props.cssPreprocessor.key === 'ruby-sass') { -%>
    .pipe(cssFilter.restore)
<% } -%>
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({ stream: true }));
});


/**
 * Adapted from generator-gulp-angular's _watch.js
 */

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', [<%- watchTaskDeps.join(', ') %>], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

<% if (props.cssPreprocessor.extension === 'css') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), function(event) {
<% } else { -%>
  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.<%- props.cssPreprocessor.extension %>')
  ], function(event) {
<% } -%>
    if(isOnlyChange(event)) {
<% if (props.cssPreprocessor.key === 'none') { -%>
      browserSync.reload(event.path);
<% } else { -%>
      gulp.start('styles');
<% } -%>
    } else {
      gulp.start('inject');
    }
  });

<% if (props.jsPreprocessor.srcExtension !== 'es6') { -%>
<%   if (props.jsPreprocessor.extension === 'js') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
<%   } else { -%>
  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join(conf.paths.src, '/app/**/*.<%- props.jsPreprocessor.extension %>')
  ], function(event) {
<%   } -%>
    if(isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });
<% } -%>

<% if (props.htmlPreprocessor.key !== 'none') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.<%- props.htmlPreprocessor.extension %>'), ['markups']);

<% } -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});


/**
 * Adapted from generator-gulp-angular's e2e-tests.js
 */


// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {
  var params = process.argv;
  var args = params.length > 3 ? [params[3], params[4]] : [];

  gulp.src(path.join(conf.paths.e2e, '/**/*.js'))
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
      args: args
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
}

gulp.task('protractor', ['protractor:src']);
gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);


/**
 * Adapted from generator-gulp-angular's tsd.js
 */

<% if (props.jsPreprocessor.key === 'typescript') { -%>

var tsd = require('tsd');

var tsdJson = 'tsd.json';
var tsdApi = new tsd.getAPI(tsdJson);

gulp.task('tsd:install', function () {
  var bower = require(path.join(process.cwd(), 'bower.json'));

  var dependencies = [].concat(
    Object.keys(bower.dependencies),
    Object.keys(bower.devDependencies)
  );

  var query = new tsd.Query();
  dependencies.forEach(function (dependency) {
    query.addNamePattern(dependency);
  });
  query.addNamePattern('karma-jasmine');

  var options = new tsd.Options();
  options.resolveDependencies = true;
  options.overwriteFiles = true;
  options.saveBundle = true;

  return tsdApi.readConfig()
    .then(function () {
      return tsdApi.select(query, options);
    })
    .then(function (selection) {
      return tsdApi.install(selection, options);
    })
    .then(function (installResult) {
      var written = Object.keys(installResult.written.dict);
      var removed = Object.keys(installResult.removed.dict);
      var skipped = Object.keys(installResult.skipped.dict);

      written.forEach(function (dts) {
        gutil.log('Definition file written: ' + dts);
      });

      removed.forEach(function (dts) {
        gutil.log('Definition file removed: ' + dts);
      });

      skipped.forEach(function (dts) {
        gutil.log('Definition file skipped: ' + dts);
      });
    });
});

gulp.task('tsd:purge', function () {
  return tsdApi.purge(true, true);
});

gulp.task('tsd', ['tsd:install']);

<% } -%>

/**
 * Adapted from generator-gulp-angular's unit-tests.js
 */

var karma = require('karma');

function runTests (singleRun, done) {
  karma.server.start({
    configFile: path.join(__dirname, '/karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, done);
}

gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
