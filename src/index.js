#!/usr/bin/env node

const program = require('commander');

program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]')
  .command('init', 'generate a new project from a template')
  .command('list', 'list available official templates')
  .parse(process.argv);

