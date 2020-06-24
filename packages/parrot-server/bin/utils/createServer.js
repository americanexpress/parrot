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

const path = require('path');
const express = require('express');
const parrot = require('parrot-middleware');

const createServer = pathToScenarios => {
  const absolutePathToScenarios = path.isAbsolute(pathToScenarios)
    ? pathToScenarios
    : path.resolve(pathToScenarios);
  const app = express();

  // eslint-disable-next-line global-require, import/no-dynamic-require
  app.use(parrot(require(absolutePathToScenarios)));

  return app;
};

module.exports = createServer;
