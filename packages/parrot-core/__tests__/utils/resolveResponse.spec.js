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

import { resolveResponse } from '../../src/utils';

describe('resolveResponse', () => {
  expect.assertions(1);

  let resolver;
  beforeEach(() => {
    resolver = jest.fn();
  });

  it('handles undefined mock', async () => {
    resolveResponse({}, {}, undefined, resolver);

    expect(resolver).toHaveBeenCalled();
  });

  it('handles mock without request', async () => {
    expect.assertions(1);

    const mock = {
      response: {
        body: 'squawk',
      },
    };
    await resolveResponse({}, {}, mock, resolver);

    expect(resolver).toHaveBeenCalledWith({ body: 'squawk' });
  });

  it('sets params', async () => {
    expect.assertions(1);

    const mock = {
      request: {
        path: '/:ahoy',
      },
      response: {
        body: jest.fn(req => req),
      },
    };
    await resolveResponse({ path: '/squawk' }, {}, mock, resolver);

    expect(mock.response.body).toHaveBeenCalledWith(
      {
        path: '/squawk',
        params: {
          ahoy: 'squawk',
        },
      },
      {}
    );
  });

  it('does not set params', async () => {
    expect.assertions(1);

    const mock = {
      request: {},
      response: {
        body: jest.fn(req => req),
      },
    };
    await resolveResponse({}, {}, mock, resolver);

    expect(mock.response.body).toHaveBeenCalledWith({}, {});
  });

  it('delays resolving response', async () => {
    expect.assertions(1);

    global.setTimeout = jest.fn(fn => fn());
    const mock = {
      request: {},
      response: {
        body: 'squawk',
        delay: 1234,
      },
    };
    await resolveResponse({}, {}, mock, resolver);

    expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1234);
  });
});
