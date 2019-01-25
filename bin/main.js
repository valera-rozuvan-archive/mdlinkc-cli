#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_version_1 = require("./app-version");
const mdlinkc_1 = require("mdlinkc");
function greeter(msg) {
    return msg;
}
const helloMsg = `mdlinkc v${app_version_1.AppVersion.version}`;
console.log(greeter(helloMsg));
console.log('');
mdlinkc_1.Mdlinkc.getLinks().forEach((link, id) => {
    console.log(`[link ${id}]: ${link}`);
});
//# sourceMappingURL=main.js.map