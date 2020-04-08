#!/usr/bin/env node

const download = require('download-git-repo');
const program = require('commander');
const exists = require('fs').existsSync;
const path = require('path');
const ora = require('ora');
const home = require('user-home');
const tildify = require('tildify');
const chalk = require('chalk');
const inquirer = require('inquirer');
const rm = require('rimraf').sync;
const logger = require('./lib/logger');
const generate = require('./lib/generate');
const checkVersion = require('./lib/check-version');
const localPath = require('./lib/local-path');
const fs = require('fs-extra');

const isLocalPath = localPath.isLocalPath;
const getTemplatePath = localPath.getTemplatePath;

/**
 * Usage.
 */

program
  .usage('<template-name> [project-name]')
  .option('-c, --clone', 'use git clone')
  .option('--offline', 'use cached template');

/**
 * Help.
 */

program.on('--help', () => {
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

let template = program.args[0]; 

const hasSlash = template.indexOf('/') > -1; // 检查有没有斜杠
const rawName = program.args[1]; // 拿到init后的第二个参数
const inPlace = !rawName || rawName === '.'; // 若没有第二个参数或者第二个参数为 . 则在当前目录
const name = inPlace ? path.relative('../', process.cwd()) : rawName; // 要复制的文件名 可能是当前目录
const to = path.resolve(rawName || '.'); // 得到要复制的路径
const clone = program.clone || false; // 是否有clone参数
fs.ensureDirSync(path.join(home, '.vodka-templates'));
const tmp = path.join(home, '.vodka-templates', template.replace(/[\/:]/g, '-'));
if (program.offline) {
  console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`);
  template = tmp;
}

/**
 * Padding.
 */

console.log();
process.on('exit', () => {
  console.log();
});

if (inPlace || exists(to)) { // 若在当前文件夹生成 或目标文件夹已经存在
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) { // 如果用户确定 在本文件夹生成
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
  if (isLocalPath(template)) { // 判断init后的第一个参数是否是一个本地路径
    const templatePath = getTemplatePath(template); // 获得本地文件
    if (exists(templatePath)) { // 若本地文件存在
      generate(name, templatePath, to, err => {
        if (err) logger.fatal(err);
        console.log();
        logger.success('Generated "%s".', name);
      });
    } else {
      logger.fatal('Local template "%s" not found.', template);
    }
  } else { // 不是本地文件 拉取远程仓库
    checkVersion(() => {
      if (!hasSlash) { // 官方组件库
        // use official templates
        const officialTemplate = 'xikou1314/' + 'vodka-template-' + template;
          downloadAndGenerate(officialTemplate);
      } else { // 另外的远程库
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
  const spinner = ora('downloading template');
  spinner.start();
  // Remove if local template exists
  if (exists(tmp)) rm(tmp);
  download(template, tmp, { clone }, err => {
    spinner.stop();
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
    generate(name, tmp, to, err => {
      if (err) logger.fatal(err);
      console.log();
      logger.success('Generated "%s".', name);
    });
  });
}
