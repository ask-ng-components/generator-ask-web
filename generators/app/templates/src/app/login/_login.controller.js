(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($location, $timeout, $translate, $document, tmhDynamicLocale) {
    var vm = this;

    vm.progress = null;
    vm.message = null;
    vm.submitLogin = submitLogin;
    vm.img = {
      src: 'assets/images/yeoman.png',
      alt: 'Yeoman tipping hat',
      subtitle: 'The login example'
    };

    vm.changeLang = changeLang;
    vm.strings = {};

    activate();

    function activate() {
      $translate(['login.username', 'login.password', 'login.submit', 'login.remember'])
      .then(function(translations){
        vm.strings.username = translations['login.username'];
        vm.strings.password = translations['login.password'];
        vm.strings.submit = translations['login.submit'];
        vm.strings.remember = translations['login.remember'];
      });
    }

    function changeLang(langCode) {

      //TODO: replace with (shared) language service
      $translate.use(langCode);
      // the rest should be executed after angular-translate's rootScope event
      $document[0].documentElement.setAttribute('lang', langCode);
      tmhDynamicLocale.set(langCode); // returns a promise

      // should be executed after all of the above to refresh strings in ask-login
      activate();
    }

    function submitLogin(username, password) {
      // validate that there is a username and password
      if (!username || !password) {
        if (!username && !password) {

          vm.message = 'Please provide a username and password.';

        } else {

          if (!username) {
            vm.message = 'Please provide a username';
          } else {
            vm.message = 'Please provide a password';
          }
        }

        return;
      }

      // send auth request
      //TODO: replace with service promises
      $timeout(function(){
        vm.progress = 0;
        vm.message = 'Loading groups';
      }, 1000);
      $timeout(function(){
        vm.progress = 25;
        vm.message = 'Loading members';
      }, 1500);
      $timeout(function(){
        vm.progress = 50;
        vm.message = 'Loading status';
      }, 2250);
      $timeout(function(){
        vm.progress = 100;
        vm.message = 'Done';
      }, 3000);

      $timeout(function(){
        $location.path('/main');
      }, 3600);
    }
  }
})();
