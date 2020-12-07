'use strict';

var path = require('path');
var fs = require('fs');

var _require = require('./utils'),
    sortDependencies = _require.sortDependencies,
    installDependencies = _require.installDependencies,
    runLintFix = _require.runLintFix,
    printMessage = _require.printMessage;

var pkg = require('./package.json');

var templateVersion = pkg.version;

var _require2 = require('./scenarios'),
    addTestAnswers = _require2.addTestAnswers;

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or: function if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
    template_version: function template_version() {
      return templateVersion;
    }
  },

  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name'
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project'
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author'
    },
    build: {
      when: 'isNotTest',
      type: 'list',
      message: 'Vue build',
      choices: [{
        name: 'Runtime + Compiler: recommended for most users',
        value: 'standalone',
        short: 'standalone'
      }, {
        name: 'Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere',
        value: 'runtime',
        short: 'runtime'
      }]
    },
    router: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install vue-router?'
    },
    lint: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Use ESLint to lint your code?'
    },
    lintConfig: {
      when: 'isNotTest && lint',
      type: 'list',
      message: 'Pick an ESLint preset',
      choices: [{
        name: 'Standard (https://github.com/standard/standard)',
        value: 'standard',
        short: 'Standard'
      }, {
        name: 'Airbnb (https://github.com/airbnb/javascript)',
        value: 'airbnb',
        short: 'Airbnb'
      }, {
        name: 'none (configure it yourself)',
        value: 'none',
        short: 'none'
      }]
    },
    unit: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Set up unit tests'
    },
    runner: {
      when: 'isNotTest && unit',
      type: 'list',
      message: 'Pick a test runner',
      choices: [{
        name: 'Jest',
        value: 'jest',
        short: 'jest'
      }, {
        name: 'Karma and Mocha',
        value: 'karma',
        short: 'karma'
      }, {
        name: 'none (configure it yourself)',
        value: 'noTest',
        short: 'noTest'
      }]
    },
    e2e: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Setup e2e tests with Nightwatch?'
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message: 'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [{
        name: 'Yes, use NPM',
        value: 'npm',
        short: 'npm'
      }, {
        name: 'Yes, use Yarn',
        value: 'yarn',
        short: 'yarn'
      }, {
        name: 'No, I will handle that myself',
        value: false,
        short: 'no'
      }]
    }
  },
  filters: {
    '.eslintrc.js': 'lint',
    '.eslintignore': 'lint',
    'config/test.env.js': 'unit || e2e',
    'build/webpack.test.conf.js': "unit && runner === 'karma'",
    'test/unit/**/*': 'unit',
    'test/unit/index.js': "unit && runner === 'karma'",
    'test/unit/jest.conf.js': "unit && runner === 'jest'",
    'test/unit/karma.conf.js': "unit && runner === 'karma'",
    'test/unit/specs/index.js': "unit && runner === 'karma'",
    'test/unit/setup.js': "unit && runner === 'jest'",
    'test/e2e/**/*': 'e2e',
    'src/router/**/*': 'router'
  },
  complete: function complete(data, _ref) {
    var chalk = _ref.chalk;

    var green = chalk.green;

    sortDependencies(data, green);

    var cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName);

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green).then(function () {
        return runLintFix(cwd, data, green);
      }).then(function () {
        printMessage(data, green);
      }).catch(function (e) {
        console.log(chalk.red('Error:'), e);
      });
    } else {
      printMessage(data, chalk);
    }
  }
};