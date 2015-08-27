(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .factory('navbarService', navbarService);

  /** @ngInject */
  function navbarService($rootScope, $location) {

    $rootScope.$on('$routeChangeSuccess', function() {

      $rootScope.global = $rootScope.global || {};

      if ($location.path() === '/login') {
        $rootScope.global.navbar = false;
      }
      else {
        $rootScope.global.navbar = true;
      }

    });

    return {};
  }
})();
