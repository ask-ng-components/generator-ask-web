(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .config(config)
    .config(i18nConfig);

  /** @ngInject */
  function config($logProvider, toastr) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
  }

  function i18nConfig($translateProvider, locales) {
    $translateProvider
      .useSanitizeValueStrategy('sanitize')
      .translations('en', locales.en)
      .translations('nl', locales.nl)
      .preferredLanguage('nl');
  }

})();
