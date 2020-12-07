#!/usr/bin/env node

const logger = require('./lib/logger');
const request = require('request');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')

/**
 * Padding.
 */

console.log();
process.on('exit', () => {
  console.log();
});

/**
 * List packages.
 */

fs.readdir(path.resolve(__dirname, '../packages') , (err, files) => {
  if (err) logger.fatal(err)
  console.log('  Available official templates:');
  console.log();
  files.forEach(fileName => {
    console.log(
      '  ' + chalk.yellow('★') +
      '  ' + chalk.blue(fileName));
  });
});

