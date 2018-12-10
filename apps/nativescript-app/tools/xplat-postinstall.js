//#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Copy potential hooks from root dependencies to app
const hooksSrc = '../../hooks';
const hooksDest = 'hooks';
console.info(`Copying ${hooksSrc} -> ${hooksDest}`);
try {
  fs.copySync(hooksSrc, hooksDest);
} catch (err) {
  // ignore
}

console.warn('Removing imagepicker / camera-plus Podfile because of conflict on QBImagePickerController.');
try {
  fs.unlinkSync('node_modules/nativescript-imagepicker/platforms/ios/Podfile');
  fs.unlinkSync('node_modules/@nstudio/nativescript-camera-plus/platforms/ios/Podfile');
} catch (e) {
  // ignore, already done
}
