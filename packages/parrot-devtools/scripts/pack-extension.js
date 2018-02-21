/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

/* eslint import/no-extraneous-dependencies: 'off' */
const fs = require('fs-extra');
const zipAndRm = require('./zip-and-rm');

fs.removeSync('./parrot-devtools-extension');
fs.ensureDirSync('./parrot-devtools-extension');
fs.copySync('./dist/extension', './parrot-devtools-extension');
fs.copySync('./src/browser/views/extension', './parrot-devtools-extension/views');
fs.copySync('./src/assets', './parrot-devtools-extension/assets');
fs.copySync('./src/browser/extension/manifest.json', './parrot-devtools-extension/manifest.json');
zipAndRm('./parrot-devtools-extension', './parrot-devtools-extension.zip');
