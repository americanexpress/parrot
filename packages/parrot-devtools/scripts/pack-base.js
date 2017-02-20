const fs = require('fs-extra');
const zipAndRm = require('./zip-and-rm');

fs.removeSync('./parrot-devtools');
fs.ensureDirSync('./parrot-devtools');
fs.copySync('./dist/base', './parrot-devtools');
fs.copySync('./src/browser/views/base', './parrot-devtools');
zipAndRm('./parrot-devtools', './parrot-devtools.zip');
