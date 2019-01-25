import { AppVersion } from './app_version';

function greeter(msg: string) {
  return msg;
}

const helloMsg = `mdlinkc v${AppVersion.version}`;

console.log(greeter(helloMsg));
