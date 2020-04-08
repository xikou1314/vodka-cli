#!/usr/bin/env node
'use strict';

var logger = require('./lib/logger');
var request = require('request');
var chalk = require('chalk');

/**
 * Padding.
 */

console.log();
process.on('exit', function () {
  console.log();
});

/**
 * List repos.
 */

request({
  url: 'https://api.github.com/users/xikou1314/repos',
  headers: {
    'User-Agent': 'vodka-cli'
  }
}, function (err, res, body) {
  if (err) logger.fatal(err);
  var requestBody = JSON.parse(body);
  if (Array.isArray(requestBody)) {
    console.log('  Available official templates:');
    console.log();
    requestBody.forEach(function (repo) {
      if (repo.name.indexOf('vodka-template-') > -1) {
        var start = repo.name.lastIndexOf('-');
        var name = repo.name.slice(start + 1);

        console.log('  ' + chalk.yellow('★') + '  ' + chalk.blue(name) + ' - ' + repo.description);
      }
    });
  } else {
    console.error(requestBody.message);
  }
});