const fs = require('fs-extra');
const zipAndRm = require('./zip-and-rm');

fs.removeSync('./parrot-devtools-chrome-extension');
fs.ensureDirSync('./parrot-devtools-chrome-extension');
fs.copySync('./dist/chrome', './parrot-devtools-chrome-extension');
fs.copySync('./src/browser/views/chrome', './parrot-devtools-chrome-extension/views');
fs.copySync('./src/assets', './parrot-devtools-chrome-extension/assets');
fs.copySync('./src/browser/extension/manifest.json', './parrot-devtools-chrome-extension/manifest.json');
zipAndRm('./parrot-devtools-chrome-extension', './parrot-devtools-chrome-extension.zip');
