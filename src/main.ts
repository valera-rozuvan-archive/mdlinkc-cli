import { Mdlinkc } from 'mdlinkc';
import * as chalk from 'chalk'
import * as path from 'path'

import { AppVersion } from './app-version';

function greeter(msg: string) {
  return msg;
}

const helloMsg = `mdlinkc-cli v${AppVersion.version}`;
console.log(greeter(helloMsg));
console.log('');

const passSymbol = '\u2714'
const failSymbol = '\u2716'

async function testDir(dirName) {
  let status = await Mdlinkc.checkIfDirExists(dirName)

  if (status) {
    console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(dirName)} directory exists.`)
    return 1
  } else {
    console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(dirName)} directory does NOT exist.`)
    return 0
  }
}

async function checkRequiredDirs() {
  let testDirCounter = 0
  const dirsToTest = ['templates', 'contents', 'configs', 'scripts']
  for (let c1 = 0; c1 < dirsToTest.length; c1 += 1) {
    const dir = dirsToTest[c1]
    testDirCounter += await testDir(dir)
  }
  if (testDirCounter !== 4) {
    console.log('')
    console.log('Some directories are missing. Exiting ...')
    process.exit(1)
  }
}

async function loadConfigFile(configName) {
  const shortPath = `./configs/${configName}.js`
  const fullPath = path.join(process.cwd(), shortPath)

  let config
  try {
    config = require(fullPath)
    console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(shortPath)} config file was loaded.`)
    return config
  } catch (err) {
    console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(shortPath)} config file could NOT be loaded.`)
    return null
  }
}

async function loadAllConfigs(configs) {
  let configCounter = 0
  const configsToLoad = ['pages', 'variables', 'meta']
  for (let c1 = 0; c1 < configsToLoad.length; c1 += 1) {
    const configName = configsToLoad[c1]
    configs[configName] = await loadConfigFile(configName)

    if (configs[configName] !== null) {
      configCounter += 1
    }
  }
  if (configCounter !== 3) {
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
}

const configs = {
  pages: null,
  variables: null,
  meta: null
}

run(configs)
