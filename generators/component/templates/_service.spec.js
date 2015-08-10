(function() {
  'use strict';

  describe('service <%- camelName %>', function() {
    var <%- camelName %>;
    var $httpBackend;
    var $log;

    beforeEach(module('<%- props.appName %>'));
    beforeEach(inject(function(_<%- camelName %>_) {
      <%- camelName %> = _<%- camelName %>_;
    }));

    it('should be registered', function() {
      expect(<%- camelName %>).not.toEqual(null);
    });

    describe('exampleValue variable', function() {
      it('should exist', function() {
        expect(<%- camelName %>.exampleValue).not.toEqual(null);
      });
    });

    describe('setValue function', function() {
      it('should exist', function() {
        expect(<%- camelName %>.setValue).not.toEqual(null);
      });

      it('should set the value', function() {
        <%- camelName %>.setValue('testVal');
        expect(<%- camelName %>.exampleValue).toEqual('testVal');
      });
    });
  });
})();
