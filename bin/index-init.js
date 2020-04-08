#!/usr/bin/env node
'use strict';

var download = require('download-git-repo');
var program = require('commander');
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
 * Usage.
 */

program.usage('<template-name> [project-name]').option('-c, --clone', 'use git clone').option('--offline', 'use cached template');

/**
 * Help.
 */

program.on('--help', function () {
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # create a new project with an official template'));
  console.log('    $ vodka init weex my-project');
  console.log();
  console.log(chalk.gray('    # create a new project straight from a github template'));
  console.log('    $ vodka init username/repo my-project');
  console.log();
});

/**
 * Help.
 */

function help() {
  program.parse(process.argv);
  if (program.args.length < 1) return program.help();
}
help();

/**
 * Settings.
 */

var template = program.args[0];

var hasSlash = template.indexOf('/') > -1; // 检查有没有斜杠
var rawName = program.args[1]; // 拿到init后的第二个参数
var inPlace = !rawName || rawName === '.'; // 若没有第二个参数或者第二个参数为 . 则在当前目录
var name = inPlace ? path.relative('../', process.cwd()) : rawName; // 要复制的文件名 可能是当前目录
var to = path.resolve(rawName || '.'); // 得到要复制的路径
var clone = program.clone || false; // 是否有clone参数
fs.ensureDirSync(path.join(home, '.vodka-templates'));
var tmp = path.join(home, '.vodka-templates', template.replace(/[\/:]/g, '-'));
if (program.offline) {
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

/**
 * Check, download and generate the project.
 */

function run() {
  // check if template is local
  if (isLocalPath(template)) {
    // 判断init后的第一个参数是否是一个本地路径
    var templatePath = getTemplatePath(template); // 获得本地文件
    if (exists(templatePath)) {
      // 若本地文件存在
      generate(name, templatePath, to, function (err) {
        if (err) logger.fatal(err);
        console.log();
        logger.success('Generated "%s".', name);
      });
    } else {
      logger.fatal('Local template "%s" not found.', template);
    }
  } else {
    // 不是本地文件 拉取远程仓库
    checkVersion(function () {
      if (!hasSlash) {
        // 官方组件库
        // use official templates
        var officialTemplate = 'xikou1314/' + 'vodka-template-' + template;
        downloadAndGenerate(officialTemplate);
      } else {
        // 另外的远程库
        downloadAndGenerate(template);
      }
    });
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
  download(template, tmp, { clone: clone }, function (err) {
    spinner.stop();
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
    generate(name, tmp, to, function (err) {
      if (err) logger.fatal(err);
      console.log();
      logger.success('Generated "%s".', name);
    });
  });
}