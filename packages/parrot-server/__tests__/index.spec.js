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

import { spawn, spawnSync } from 'child_process';
import fetch from 'node-fetch';
import waitPort from 'wait-port';

const runningParrotServerProcesses = [];

jest.setTimeout(10000);

const executeParrotServerCommand = async parrotServerArgs => {
  const { portNumber, pathToScenarios } = parrotServerArgs;

  const args = [require.resolve('../bin/index.js'), '--scenarios', pathToScenarios];
  if (portNumber) {
    args.push('--port', portNumber);
  }
  const parrotServerProcess = spawn('node', args);

  /* eslint-disable no-console */
  parrotServerProcess.stdout.on('data', data => console.log(data.toString()));
  parrotServerProcess.stderr.on('data', data => console.error(data.toString()));
  /* eslint-enable */
  let isParrotUp;
  try {
    isParrotUp = await waitPort({ port: portNumber || 3001, timeout: 5000, output: 'silent' });
  } catch (error) {
    throw new Error(error);
  }
  if (isParrotUp) {
    runningParrotServerProcesses.push(parrotServerProcess);
    return parrotServerProcess;
  }

  throw new Error('parrot-server did not start up within 5 seconds');
};

it('defaults to port 3001 if --port is not given', async () => {
  const args = { pathToScenarios: require.resolve('../__fixtures__/scenarios.js') };
  await executeParrotServerCommand(args);

  const response = await fetch('http://localhost:3001/parrot/scenarios');
  expect(response.status).toBe(200);
});

it('starts server on given port', async () => {
  const portNumber = 3005;
  const args = {
    pathToScenarios: require.resolve('../__fixtures__/scenarios.js'),
    portNumber,
  };

  await executeParrotServerCommand(args);

  const response = await fetch(`http://localhost:${portNumber}/parrot/scenarios`);
  expect(response.status).toBe(200);
});

it('exits with status 1 if something goes wrong while starting the server', () => {
  expect.assertions(1);

  const args = [
    require.resolve('../bin/index.js'),
    '--scenarios',
    '../__fixtures__/not-a-valid-scenarios-file.js',
  ];

  const parrotServerProcess = spawnSync('node', args, { timeout: 5000 });

  /* eslint-disable no-console */
  console.log(parrotServerProcess.stderr.toString());
  console.log(parrotServerProcess.stdout.toString());
  /* eslint-enable */

  expect(parrotServerProcess.status).toBe(1);
});

afterAll(() => {
  runningParrotServerProcesses.forEach(process => process.kill());
});
