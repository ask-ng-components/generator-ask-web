(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log<% if (props.projectType === 'askApp') { %>, navbarService<% } %>) {

    $log.debug('runBlock end');
  }

})();
