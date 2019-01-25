#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_version_1 = require("./app_version");
function greeter(msg) {
    return msg;
}
const helloMsg = `mdlinkc v${app_version_1.AppVersion.version}`;
console.log(greeter(helloMsg));
//# sourceMappingURL=main.js.map