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
const { add, λ } = require('lambda-math');
const app_version_1 = require("./app-version");
const run_proc_1 = require("./run_proc");
function greeter(msg) {
    return msg;
}
const helloMsg = `mdlinkc-cli v${app_version_1.AppVersion.version}`;
console.log(greeter(helloMsg));
console.log('');
const CWD = process.cwd();
const passSymbol = '\u2714';
const failSymbol = '\u2716';
function checkRequiredDirs() {
    return __awaiter(this, void 0, void 0, function* () {
        const dirsToTest = ['templates', 'contents', 'configs', 'scripts'];
        let c1 = 0;
        λ.reset();
        λ(add, [0, 0]);
        for (c1 = 0; c1 < dirsToTest.length; c1 += 1) {
            const dirName = dirsToTest[c1];
            const status = yield mdlinkc_1.Mdlinkc.checkIfDirExists(CWD, dirName);
            if (status === true) {
                console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(dirName)} directory exists.`);
                λ(add, [λ[c1], 1]);
            }
            else {
                console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(dirName)} directory does NOT exist.`);
                λ(add, [λ[c1], 0]);
            }
        }
        if (λ[c1].number !== 4) {
            console.log('');
            console.log('Some directories are missing. Exiting ...');
            process.exit(1);
        }
    });
}
function loadAllConfigs(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        const configsToLoad = ['pages', 'variables', 'meta'];
        let c1 = 0;
        λ.reset();
        λ(add, [0, 0]);
        for (c1 = 0; c1 < configsToLoad.length; c1 += 1) {
            const configName = configsToLoad[c1];
            let config = yield mdlinkc_1.Mdlinkc.loadConfigFile(CWD, configName);
            if (config !== null) {
                console.log(`[${chalk.green(passSymbol)}] ${chalk.bold(configName)} config file was loaded.`);
                configs[configName] = config;
                λ(add, [λ[c1], 1]);
            }
            else {
                console.log(`[${chalk.red(failSymbol)}] ${chalk.bold(configName)} config file could NOT be loaded.`);
                λ(add, [λ[c1], 0]);
            }
        }
        if (λ[c1].number !== 3) {
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
function processPages(configs) {
    return __awaiter(this, void 0, void 0, function* () {
        let c1 = 0;
        for (c1 = 0; c1 < configs.pages.length; c1 += 1) {
            const pageConfig = configs.pages[c1];
            const results = yield run_proc_1.runProc(CWD, pageConfig, configs);
            console.log('child process exited with ' +
                `code ${results.code} and signal ${results.signal}.`);
            console.log('');
        }
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
        yield processPages(configs);
    });
}
const configs = {
    pages: null,
    variables: null,
    meta: null
};
run(configs);
//# sourceMappingURL=main.js.map