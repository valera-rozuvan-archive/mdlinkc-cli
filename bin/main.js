#!/usr/bin/env node

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mdlinkc_1 = require("mdlinkc");
const chalk = require("chalk");
const path = require("path");
const app_version_1 = require("./app-version");
function greeter(msg) {
    return msg;
}
const helloMsg = `mdlinkc-cli v${app_version_1.AppVersion.version}`;
console.log(greeter(helloMsg));
console.log('');
const passSymbol = '\u2714';
const failSymbol = '\u2716';
function testDir(dirName) {
    return __awaiter(this, void 0, void 0, function* () {
        let status = yield mdlinkc_1.Mdlinkc.checkIfDirExists(dirName);
        if (status) {
            console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(dirName)} directory exists.`);
            return 1;
        }
        else {
            console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(dirName)} directory does NOT exist.`);
            return 0;
        }
    });
}
function checkRequiredDirs() {
    return __awaiter(this, void 0, void 0, function* () {
        let testDirCounter = 0;
        const dirsToTest = ['templates', 'contents', 'configs', 'scripts'];
        for (let c1 = 0; c1 < dirsToTest.length; c1 += 1) {
            const dir = dirsToTest[c1];
            testDirCounter += yield testDir(dir);
        }
        if (testDirCounter !== 4) {
            console.log('');
            console.log('Some directories are missing. Exiting ...');
            process.exit(1);
        }
    });
}
function loadConfigFile(configName) {
    return __awaiter(this, void 0, void 0, function* () {
        const shortPath = `./configs/${configName}.js`;
        const fullPath = path.join(process.cwd(), shortPath);
        let config;
        try {
            config = require(fullPath);
            console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(shortPath)} config file was loaded.`);
            return config;
        }
        catch (err) {
            console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(shortPath)} config file could NOT be loaded.`);
            return null;
        }
    });
}
function loadAllConfigs(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        let configCounter = 0;
        const configsToLoad = ['pages', 'variables', 'meta'];
        for (let c1 = 0; c1 < configsToLoad.length; c1 += 1) {
            const configName = configsToLoad[c1];
            configs[configName] = yield loadConfigFile(configName);
            if (configs[configName] !== null) {
                configCounter += 1;
            }
        }
        if (configCounter !== 3) {
            console.log('');
            console.log('Some configs are missing. Exiting ...');
            process.exit(1);
        }
    });
}
function printNumThreads(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('configs.meta = ', configs.meta);
        console.log('configs.meta.threads = ', configs.meta.threads);
    });
}
function printFirstPage(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('configs.pages = ', configs.pages);
        console.log('configs.pages[0] = ', configs.pages[0]);
    });
}
function printAuthorVariable(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('configs.variables = ', configs.variables);
        console.log('configs.variables.AUTHOR = ', configs.variables.AUTHOR);
    });
}
function run(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[DIRS]');
        yield checkRequiredDirs();
        console.log('');
        console.log('[CONFIGS]');
        yield loadAllConfigs(configs);
        console.log('');
        yield printNumThreads(configs);
        console.log('');
        yield printFirstPage(configs);
        console.log('');
        yield printAuthorVariable(configs);
        console.log('');
    });
}
const configs = {
    pages: null,
    variables: null,
    meta: null
};
run(configs);
//# sourceMappingURL=main.js.map