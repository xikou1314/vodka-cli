#!/usr/bin/env node
'use strict';

var download = require('download-git-repo');
var exists = require('fs').existsSync;
var path = require('path');
var ora = require('ora');
var home = require('user-home');
var tildify = require('tildify');
var chalk = require('chalk');
var inquirer = require('inquirer');
var rm = require('rimraf').sync;
var logger = require('./lib/logger');
var generate = require('./lib/generate');
var checkVersion = require('./lib/check-version');
var localPath = require('./lib/local-path');
var fs = require('fs-extra');

var isLocalPath = localPath.isLocalPath;
var getTemplatePath = localPath.getTemplatePath;

/**
 * Settings.
 */

module.exports = function (template, filePath, options) {

  // 是否有斜杠 有斜杠的为远程仓库
  var hasSlash = template.indexOf('/') > -1;
  // 文件路径
  var rawName = filePath;
  // 当前目录
  var inPlace = !rawName || rawName === '.';
  // 获取要复制到的文件夹名
  var name = inPlace ? path.relative('../', process.cwd()) : rawName;
  // 要复制到的文件夹
  var to = path.resolve(rawName || '.');
  // 是否有clone参数
  var clone = options.clone || false;
  // 确保模板保存的路径存在
  fs.ensureDirSync(path.join(home, '.vodka'));
  // 模板保存的文件夹
  var tmp = path.join(home, '.vodka', template.replace(/[\/:]/g, '-'));
  // 离线
  if (options.offline) {
    console.log('> Use cached template at ' + chalk.yellow(tildify(tmp)));
    template = tmp;
  }

  /**
   * Padding.
   */

  console.log();
  process.on('exit', function () {
    console.log();
  });

  if (inPlace || exists(to)) {
    // 若在当前文件夹生成 或目标文件夹已经存在
    inquirer.prompt([{
      type: 'confirm',
      message: inPlace ? 'Generate project in current directory?' : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(function (answers) {
      if (answers.ok) {
        // 如果用户确定 在本文件夹生成
        run();
      }
    }).catch(logger.fatal);
  } else {
    run();
  }

  function run() {
    // check if template is local

    // 不包含斜杠的时候从packages目录中拉取文件

    if (!hasSlash) {
      var packagePath = localPath.getPackagePath(template);
      if (exists(packagePath)) {
        // 若本地文件存在
        generate(name, packagePath, to, function (err) {
          if (err) logger.fatal(err);
          console.log();
          logger.success('Generated "%s".', name);
        });
      } else {
        logger.fatal('Local template "%s" not found.', template);
      }
    } else {
      // 不是本地文件 拉取远程仓库
      // 如果是离线的 则从.vodka中拉取对应的文件
      if (isLocalPath(template)) {
        // 获得本地文件路径
        var templatePath = getTemplatePath(template);
        // 若本地文件存在
        if (exists(templatePath)) {
          generate(name, templatePath, to, function (err) {
            if (err) logger.fatal(err);
            console.log();
            logger.success('Generated "%s".', name);
          });
        } else {
          logger.fatal('Local template "%s" not found.', template);
        }
      } else {
        // 如果不是离线的 则从远程拉取git中对应的文件
        checkVersion(function () {
          downloadAndGenerate(template);
        });
      }
    }
  }

  /**
   * Download a generate from a template repo.
   *
   * @param {String} template
   */

  function downloadAndGenerate(template) {
    var spinner = ora('downloading template');
    spinner.start();
    // Remove if local template exists
    if (exists(tmp)) rm(tmp);
    download(template, tmp, {
      clone: clone
    }, function (err) {
      spinner.stop();
      if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
      generate(name, tmp, to, function (err) {
        if (err) logger.fatal(err);
        console.log();
        logger.success('Generated "%s".', name);
      });
    });
  }
};