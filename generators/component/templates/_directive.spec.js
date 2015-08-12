(function() {
  'use strict';

  describe('service <%- camelName %>', function() {
    var el;

    beforeEach(module('<%- props.appName %>'));
    beforeEach(inject(function($compile, $rootScope) {

      el = angular.element('<<%- kebabName %>></<%- kebabName %>>');

      $compile(el)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(el.html()).not.toEqual(null);
    });
  });
})();
