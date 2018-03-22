#!/usr/bin/env node

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

const createServer = require('../src/createServer');

const argv = require('yargs')
  .option('port', {
    alias: 'p',
    describe: 'port to start your parrot server on',
    default: 3001,
  })
  .option('scenarios', {
    alias: 's',
    describe: 'path to your scenarios file',
    demandOption: true,
  }).argv;

const startServer = options => {
  const { portNumber, pathToScenarios } = options;
  const app = createServer(pathToScenarios);

  app.listen(portNumber, error => {
    if (error) {
      throw new Error(error);
    }
    console.log(`parrot-server up and listening on port ${portNumber}`); // eslint-disable-line no-console
  });
};

const execute = () => {
  try {
    startServer({ portNumber: argv.port, pathToScenarios: argv.scenarios });
  } catch (error) {
    console.error('Error starting up parrot-server:', error); // eslint-disable-line no-console
    process.exit(1);
  }
};

execute();
