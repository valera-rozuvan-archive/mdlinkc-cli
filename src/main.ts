import { Mdlinkc } from 'mdlinkc';
import * as chalk from 'chalk'

const { add, λ } = require('lambda-math')

import { AppVersion } from './app-version';
import { runProc } from './run_proc'

function greeter(msg: string) {
  return msg;
}

const helloMsg = `mdlinkc-cli v${AppVersion.version}`;
console.log(greeter(helloMsg));
console.log('');

const CWD = process.cwd()

const passSymbol = '\u2714'
const failSymbol = '\u2716'

async function checkRequiredDirs() {
  const dirsToTest = ['templates', 'contents', 'configs', 'scripts']
  let c1 = 0

  λ.reset()
  λ(add, [0, 0])

  for (c1 = 0; c1 < dirsToTest.length; c1 += 1) {
    const dirName = dirsToTest[c1]
    const status = await Mdlinkc.checkIfDirExists(CWD, dirName)

    if (status === true) {
      console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(dirName)} directory exists.`)
      λ(add, [λ[c1], 1])
    } else {
      console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(dirName)} directory does NOT exist.`)
      λ(add, [λ[c1], 0])
    }
  }

  if (λ[c1].number !== 4) {
    console.log('')
    console.log('Some directories are missing. Exiting ...')
    process.exit(1)
  }
}

async function loadAllConfigs(configs) {
  const configsToLoad = ['pages', 'variables', 'meta']
  let c1 = 0

  λ.reset()
  λ(add, [0, 0])

  for (c1 = 0; c1 < configsToLoad.length; c1 += 1) {
    const configName = configsToLoad[c1]
    let config = await Mdlinkc.loadConfigFile(CWD, configName)

    if (config !== null) {
      console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(configName)} config file was loaded.`)
      configs[configName] = config
      λ(add, [λ[c1], 1])
    } else {
      console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(configName)} config file could NOT be loaded.`)
      λ(add, [λ[c1], 0])
    }
  }

  if (λ[c1].number !== 3) {
    console.log('')
    console.log('Some configs are missing. Exiting ...')
    process.exit(1)
  }
}

async function printNumThreads(configs) {
  console.log('configs.meta = ', configs.meta)
  console.log('configs.meta.threads = ', configs.meta.threads)
}

async function printFirstPage(configs) {
  console.log('configs.pages = ', configs.pages)
  console.log('configs.pages[0] = ', configs.pages[0])
}

async function printAuthorVariable(configs) {
  console.log('configs.variables = ', configs.variables)
  console.log('configs.variables.AUTHOR = ', configs.variables.AUTHOR)
}

async function processPages(configs) {
  let c1 = 0

  for (c1 = 0; c1 < configs.pages.length; c1 += 1) {
    const pageConfig = configs.pages[c1]
    const results = await runProc(CWD, pageConfig, configs)

    console.log(
      'child process exited with ' +
      `code ${results.code} and signal ${results.signal}.`
    )
    console.log('')
  }
}

async function run(configs) {
  console.log('[DIRS]')
  await checkRequiredDirs()
  console.log('')

  console.log('[CONFIGS]')
  await loadAllConfigs(configs)
  console.log('')

  await printNumThreads(configs)
  console.log('')

  await printFirstPage(configs)
  console.log('')

  await printAuthorVariable(configs)
  console.log('')

  await processPages(configs)
}

const configs = {
  pages: null,
  variables: null,
  meta: null
}

run(configs)
