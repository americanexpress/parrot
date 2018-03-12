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

import fetch from 'node-fetch';
import waitPort from 'wait-port';
import { spawn } from 'child_process';

const runningParrotServerProcesses = [];

jest.setTimeout(10000);

const executeParrotServerCommand = async parrotServerArgs => {
  const { portNumber, pathToScenarios } = parrotServerArgs;

  const args = [require.resolve('./parrot-server.js'), '--scenarios', pathToScenarios];
  if (portNumber) {
    args.push('--port', portNumber);
  }
  const parrotServerProcess = spawn('node', [require.resolve('./parrot-server.js'), ...args]);

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

it('exits with status 1 if something goes wrong while starting the server', async (done) => {
  expect.assertions(1);

  const args = {
    pathToScenarios: '../__fixtures__/not-a-valid-scenarios-file.js',
  };

  const parrotServerProcess = await executeParrotServerCommand(args);

  parrotServerProcess.on('exit', (code) => {
    expect(code).toBe(1);
    done();
  });
});

afterAll(() => {
  runningParrotServerProcesses.forEach(process => process.kill());
});
