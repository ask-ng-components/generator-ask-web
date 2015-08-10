(function() {
  'use strict';

  angular.module('<%- props.appName %>')
    .factory('<%- camelName %>', <%- camelName %>);

  function <%- camelName %> (){
    var exampleValue = 'example';

    var service = {
      exampleValue: exampleValue
      setValue: setValue
    }

    return service;

    function setValue(value) {
      if (typeof value === 'string') {
        exampleValue = value;
      }
    }
  };
})();
