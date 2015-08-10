(function() {
  'use strict';

  angular.module('<%- props.appName %>')
    .directive('<%- camelName %>', <%- camelName %>);

  function <%- camelName %> (){
    var directive = {
      restrict: 'EA',
<% if (props.componentType === 'component') { -%>
      templateUrl = '<%- kebabName %>.html',
<% } -%>
      link: link
    }
    return directive;

    function link(scope, element, attrs) {

    }
  };
})();
