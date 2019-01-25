import { AppVersion } from './app-version';
import { Mdlinkc } from 'mdlinkc';

function greeter(msg: string) {
  return msg;
}

const helloMsg = `mdlinkc v${AppVersion.version}`;

console.log(greeter(helloMsg));
console.log('');

Mdlinkc.getLinks().forEach((link, id) => {
  console.log(`[link ${id}]: ${link}`);
});
