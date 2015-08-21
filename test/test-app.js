'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('ask-web:app', function () {

  describe('with promo', function(){

  });

  describe('with askApp', function(){
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
          name: 'test app',
          projectType: 'askApp',
          angularModules: [
            { key: 'animate', module: 'ngAnimate' },
            { key: 'cookies', module: 'ngCookies' },
            { key: 'touch', module: 'ngTouch' },
            { key: 'sanitize', module: 'ngSanitize' }
          ],
          jsPreprocessor: {
            key: 'none',
            extension: 'js',
            srcExtension: 'js'
          },
          htmlPreprocessor: {
            key: 'none',
            extension: 'html'
          }
        })
        .on('end', done);
    });

    it('creates files', function () {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc'
      ]);
    });

    describe('login', function() {

      it('creates the login section files', function() {
        assert.file([
          'src/app/login/login.controller.js',
          'src/app/login/login.controller.spec.js',
          'src/app/login/login.html',
          'src/app/login/login.scss'
        ])
      });

      it('declares the ask-login component module', function() {
        assert.fileContent('src/app/index.module.js', /'ask\.component\.login'/);
      });

      it('depends on the ask-login component', function() {
        assert.fileContent('bower.json', /"ask-login"/);
        assert.fileContent('bower.json', /"ask-ng-components\/ask-login/); // leave the version out as it will change
      });

      it('adds the /login route', function() {
        assert.fileContent('src/app/index.route.js', /\.when\('\/login', {/);
        assert.fileContent('src/app/index.route.js', /templateUrl: 'app\/login\/login\.html',/);
        assert.fileContent('src/app/index.route.js', /controller: 'LoginController',/);
        assert.fileContent('src/app/index.route.js', /controllerAs: 'login'/);
      });
    });
  });
});
