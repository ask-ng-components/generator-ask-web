'use strict';
var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.NamedBase.extend({
  initializing: function () {
    // Grab and use config from yo-rc.json
    this.props =  this.config.get('props');

    this.camelName = _.camelCase(this.name);
    this.kebabName = _.kebabCase(this.name);
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'componentType',
      message: 'What type of component are you making?',
      choices: [{
        value: 'component',
        name: 'Component (Angular directive + template + (s)css)'
      },{
        value: 'service',
        name: 'Service (Angular service)'
      },{
        value: 'directive',
        name: 'Directive (Angular directive)'
      }]
    }];

    this.prompt(prompts, function (props) {

      _.extend(this.props, props);

      done();
    }.bind(this));
  },

  configuring: {

  },

  writing: function () {
    switch (this.props.componentType) {
      case 'service':
        this.fs.copyTpl(
          this.templatePath('_service.js'),
          this.destinationPath(this.kebabName + '.service.js'),
          this
        );
        break;
      case 'component':
        this.fs.copyTpl(
          this.templatePath('_component.html'),
          this.destinationPath(this.kebabName + '.html'),
          this
        );
        this.fs.copyTpl(
          this.templatePath('_component.css'),
          this.destinationPath(this.kebabName + '.css'),
          this
        );
        /* falls through */
      case 'directive':
        this.fs.copyTpl(
          this.templatePath('_directive.js'),
          this.destinationPath(this.kebabName + '.directive.js'),
          this
        );
        break;
    }

  }
});
