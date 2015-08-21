(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($location, $timeout) {
    var vm = this;

    vm.progress = null;
    vm.message = null;
    vm.submitLogin = submitLogin;

    activate();

    function activate() {
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
