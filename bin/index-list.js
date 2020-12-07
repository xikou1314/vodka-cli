#!/usr/bin/env node
'use strict';

var logger = require('./lib/logger');
var request = require('request');
var chalk = require('chalk');
var fs = require('fs');

/**
 * Padding.
 */

console.log();
process.on('exit', function () {
  console.log();
});

/**
 * List packages.
 */

fs.readdir('./packages', function (err, files) {
  if (err) logger.fatal(err);
  console.log('  Available official templates:');
  console.log();
  files.forEach(function (fileName) {
    console.log('  ' + chalk.yellow('★') + '  ' + chalk.blue(fileName));
  });
});