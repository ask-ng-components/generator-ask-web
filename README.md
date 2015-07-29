# generator-ask-web

A [Yeoman](http://yeoman.io) generator to scaffold web projects for Ask-CS.

Mostly based on [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular).

The project will be updated periodically and will include applicable generator-gulp-angular updates.

## Installation

You need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system (the Node.js installation should include npm by default)

If you don't already have gulp, bower and Yeoman installed globally, you can do so by executing:

`npm install -g  gulp bower yo`

To install this generator, do:

`npm install -g generator-ask-web`

You're ready to scaffold a project!

## Usage

First make a directory for your project and navigate into it:

`mkdir my-project && cd my-project`

Then start the generator, by doing:

`yo ask-web`

The generator will then ask for the project's name (default is the current directory name in kebab-case/spinal-case). The project's main module will have that same name in camelCase (`myProject` in this example).

Next, you'll need to choose between making a 'Promo website' and an 'Ask-CS application'. A 'Promo website' will have [Bootstrap](http://getbootstrap.com/) by default.

Remaining options:

**Promo website**:
- CSS or Sass (*.scss)
- HTML or Jade (*.jade)

**Ask-CS application** includes above and the following:
- UI framework
  - Bootstrap
  - Angular Material
  - None
- (if Bootstrap) Bootstrap implementation
  - Angular UI Bootstrap
  - AngularStrap
  - Official jQuery implementation
  - None, just CSS
- JavaScript preprocessor
  - None
  - ES6 (ES2015), using Babel
  - TypeScript

Once done, the generator will scaffold the project and install dependencies, and your're ready to go! (installing dependencies can take some time)

## Workflow

- `gulp` or `gulp build` to build an optimized version of your application in `/dist`
- `gulp serve` to launch a browser sync server on your source files
- `gulp serve:dist` to launch a server on your optimized application
- `gulp test` to launch your unit tests with Karma
- `gulp test:auto` to launch your unit tests with Karma in watch mode
- `gulp protractor` to launch your e2e tests with Protractor
- `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

## TODO
Things that will be worked on in the near future:
- A subgenerator to help create components (reusable angular services and directives with html/jade templates)
- A subgenerator to replace gulpfile.js with an updated version
- A subgenerator to update package.json with the gulpfile? Not sure on this
- Include useful Ask-CS components depending on project type

## License
MIT
