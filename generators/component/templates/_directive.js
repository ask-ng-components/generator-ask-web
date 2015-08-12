(function() {
  'use strict';

  angular.module('<%- props.appName %>')
    .directive('<%- camelName %>', <%- camelName %>);

  function <%- camelName %> (){
    var directive = {
      restrict: 'EA',
<% if (props.componentType === 'component') { -%>
      templateUrl: '<%- camelName %>.html',
<% } -%>
      /* Use what you need, remove the rest */
      // compile: <%- camelName %>Compile,
      // controllerAs: 'vm',
      // controller: <%- camelName %>Controller,
      // link: <%- camelName %>Link
    }
    return directive;

    // function <%- camelName %>Compile(tElement, tAttrs) {
    //
    // }

    // function <%- camelName %>Controller() {
    //   var vm = this;
    // }

    // function <%- camelName %>Link(scope, iElement, iAttrs) {
    //
    // }
  };
})();
