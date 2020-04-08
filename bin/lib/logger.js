'use strict';

var chalk = require('chalk');
var format = require('util').format;

/**
 * Prefix.
 */

var prefix = '   vodka-cli';
var sep = chalk.gray('·');

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */

exports.log = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var msg = format.apply(format, args);
  console.log(chalk.white(prefix), sep, msg);
};

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

exports.fatal = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (args[0] instanceof Error) args[0] = args[0].message.trim();
  var msg = format.apply(format, args);
  console.error(chalk.red(prefix), sep, msg);
  process.exit(1);
};

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

exports.success = function () {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var msg = format.apply(format, args);
  console.log(chalk.white(prefix), sep, msg);
};