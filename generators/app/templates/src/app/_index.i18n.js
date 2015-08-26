(function() {
  'use strict';

  angular
    .module('<%- props.appName %>')
    .constant('locales', {
      'en': {
        lang: {
          en: 'English',
          nl: 'Dutch'
        },
        login: {
          username: 'Username',
          password: 'Password',
          submit: 'Log in',
          remember: 'Remember me'
        }
      },
      'nl': {
        lang: {
          en: 'Engels',
          nl: 'Nederlands'
        },
        login: {
          username: 'Gebruikersnaam',
          password: 'Wachtwoord',
          submit: 'Inloggen',
          remember: 'Onthoud mij'
        }
      },
    });

})();
