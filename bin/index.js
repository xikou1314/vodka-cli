#!/usr/bin/env node
'use strict';

var program = require('commander');

program.version(require('../package.json').version).usage('<command> [options]').command('init', 'generate a new project from a template').command('list', 'list available official templates').parse(process.argv);