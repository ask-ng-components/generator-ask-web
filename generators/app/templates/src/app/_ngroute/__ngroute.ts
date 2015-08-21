module <%- props.appName %> {
  'use strict';

  /** @ngInject */
  export function routerConfig($routeProvider: ng.route.IRouteProvider) {
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
