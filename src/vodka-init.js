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
// 是否有斜杠 有斜杠的为远程仓库
const hasSlash = template.indexOf('/') > -1;
// 文件路径
const rawName = program.args[1];
// 当前目录
const inPlace = !rawName || rawName === '.';
// 获取要复制到的文件夹名
const name = inPlace ? path.relative('../', process.cwd()) : rawName;
// 要复制到的文件夹
const to = path.resolve(rawName || '.');
// 是否有clone参数
const clone = program.clone || false;
// 确保模板保存的路径存在
fs.ensureDirSync(path.join(home, '.vodka'));
// 模板保存的文件夹
const tmp = path.join(home, '.vodka', template.replace(/[\/:]/g, '-'));
// 离线
if (program.offline) {
  console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`);
  template = tmp;
}

console.log(localPath.getPackagePath(template))
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
    message: inPlace ?
      'Generate project in current directory?' :
      'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) { // 如果用户确定 在本文件夹生成
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
    const packagePath = localPath.getPackagePath(template)
    if (exists(packagePath)) { // 若本地文件存在
      generate(name, packagePath, to, err => {
        if (err) logger.fatal(err);
        console.log();
        logger.success('Generated "%s".', name);
      });
    } else {
      logger.fatal('Local template "%s" not found.', template);
    }
  } else { // 不是本地文件 拉取远程仓库
    // 如果是离线的 则从.vodka中拉取对应的文件
    if (isLocalPath(template)) {
       // 获得本地文件路径
      const templatePath = getTemplatePath(template);
      // 若本地文件存在
      if (exists(templatePath)) {
        generate(name, templatePath, to, err => {
          if (err) logger.fatal(err);
          console.log();
          logger.success('Generated "%s".', name);
        });
      } else {
        logger.fatal('Local template "%s" not found.', template);
      }
    } else {
    // 如果不是离线的 则从远程拉取git中对应的文件
      checkVersion(() => {
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
  const spinner = ora('downloading template');
  spinner.start();
  // Remove if local template exists
  if (exists(tmp)) rm(tmp);
  download(template, tmp, {
    clone
  }, err => {
    spinner.stop();
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
    generate(name, tmp, to, err => {
      if (err) logger.fatal(err);
      console.log();
      logger.success('Generated "%s".', name);
    });
  });
}