angular.module '<%- props.appName %>'
  .controller 'MainController', ($timeout, toastr) ->
    'ngInject'
    vm = this
    activate = ->
      $timeout (->
        vm.classAnimation = 'rubberBand'
        return
      ), 4000
      return

    showToastr = ->
      toastr.info 'Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>'
      vm.classAnimation = ''
      return

    vm.classAnimation = ''
    vm.creationDate = <%- new Date().getTime() %>
    vm.showToastr = showToastr
    activate()
    return
