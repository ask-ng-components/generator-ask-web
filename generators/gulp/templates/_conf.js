'use strict';

var gutil = require('gulp-util');

module.exports = {
  /**
   *  The main paths of your project handle these with care
   */
  paths: {
    src: '<%- props.paths.src %>',
    dist: '<%- props.paths.dist %>',
    tmp: '<%- props.paths.tmp %>',
    e2e: '<%- props.paths.e2e %>'
  },

  /**
   *  Wiredep is the lib which inject bower dependencies in your project
   *  Mainly used to inject script tags in the index.html but also used
   *  to inject css preprocessor deps and js files in karma
   */
  wiredep: {
  <% if(wiredepExclusions.length > 0) { -%>
    exclude: [<%- wiredepExclusions.join(', ') %>],
  <% } -%>
    directory: 'bower_components'
  },

  /**
   *  Common implementation for an error handler of a Gulp plugin
   */
  errorHandler: function(title) {
    'use strict';

    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    }
  }
}
