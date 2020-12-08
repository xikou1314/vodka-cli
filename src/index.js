#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk')
const { cleanOptions } = require('./lib/clean')
program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]')

program
  .command('init <template> [path]')
  .description('generate a new project from a template')
  .usage('<template-name> [project-name]')
  .option('-c, --clone', 'use git clone')
  .option('--offline', 'use cached template')
  .action((template, path, cmd) => {
    const options = cleanOptions(cmd)
    require('./init')(template, path, options)
  }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new project with an official template'));
    console.log('    $ vodka init weex my-project');
    console.log();
    console.log(chalk.gray('    # create a new project straight from a github template'));
    console.log('    $ vodka init username/repo my-project');
    console.log();
  })

program
  .command('list')
  .description('list available official templates')
  .action((cmd) => {
    require('./list.js')()
  }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # list available official templates'));
    console.log('    $ vodka list');
    console.log();
  })

program.on('--help', () => {
  console.log()
  console.log(
    `  Run ${chalk.cyan(
      'vodka <command> --help',
    )} for detailed usage of given command.`,
  )
  console.log()
})

program.commands.forEach((c) => c.on('--help', () => console.log()))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}


