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

/* eslint-disable global-require */
import request from 'supertest';
import prettyFormat from 'pretty-format';

describe('createServer', () => {
  beforeEach(() => {
    jest.resetModules().clearAllMocks();
  });

  it('can resolve scenarios file from relative path', () => {
    const createServer = require('../bin/utils/createServer');

    expect(() => createServer('./packages/parrot-server/__fixtures__/scenarios.js')).not.toThrow();
  });

  it('can resolve scenarios file from absolute path', () => {
    const createServer = require('../bin/utils/createServer');

    expect(() => createServer(require.resolve('../__fixtures__/scenarios.js'))).not.toThrow();
  });

  it('uses parrot middleware', async () => {
    const createServer = require('../bin/utils/createServer');

    const app = createServer(require.resolve('../__fixtures__/scenarios.js'));
    const response = await request(app).get('/parrot/scenarios');

    expect(response.status).toBe(200);
    expect(prettyFormat(response.body)).toMatchSnapshot();
  });

  it('returns an express application', () => {
    const mockExpressApp = { use: jest.fn() };
    jest.doMock('express', () => () => mockExpressApp);
    const createServer = require('../bin/utils/createServer');

    const app = createServer(require.resolve('../__fixtures__/scenarios.js'));
    expect(app).toEqual(mockExpressApp);
  });
});
