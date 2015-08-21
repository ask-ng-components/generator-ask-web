(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
<% if (props.projectType === 'askApp') { -%>
      .when('/login', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
<% } -%>
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
