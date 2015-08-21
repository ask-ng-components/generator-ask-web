(function() {
  'use strict';

  describe('controllers', function(){
    var vm;
    var $timeout;

    beforeEach(module('<%- props.appName %>'));
    beforeEach(inject(function(_$controller_, _$timeout_) {

      vm = _$controller_('LoginController');
      $timeout = _$timeout_;
    }));

    it('should give message on no username and password', function() {
      vm.submitLogin();
      expect(vm.message).toEqual('Please provide a username and password.');
    });
  });
})();
