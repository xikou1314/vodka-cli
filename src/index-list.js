#!/usr/bin/env node

const logger = require('./lib/logger');
const request = require('request');
const chalk = require('chalk');

/**
 * Padding.
 */

console.log();
process.on('exit', () => {
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
}, (err, res, body) => {
  if (err) logger.fatal(err);
  const requestBody = JSON.parse(body);
  if (Array.isArray(requestBody)) {
    console.log('  Available official templates:');
    console.log();
    requestBody.forEach(repo => {
      if (repo.name.indexOf('whisky-') > -1) {
        let start = repo.name.lastIndexOf('-');
        let name = repo.name.slice(start + 1);
        
        console.log(
          '  ' + chalk.yellow('★') +
          '  ' + chalk.blue(name) +
          ' - ' + repo.description);
      }
    });
  } else {
    console.error(requestBody.message);
  }
});
