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
  let resolver;
  beforeEach(() => {
    resolver = jest.fn();
  });

  it('handles undefined mock', () => {
    resolveResponse({}, {}, undefined, resolver).then(() => {
      expect(resolver).toHaveBeenCalled();
    });
  });

  it('handles mock without request', () => {
    const mock = {
      response: {
        body: 'squawk',
      },
    };
    return resolveResponse({}, {}, mock, resolver).then(() => {
      expect(resolver).toHaveBeenCalledWith({ body: 'squawk' });
    });
  });

  it('sets params', () => {
    const mock = {
      request: {
        path: '/:ahoy',
      },
      response: {
        body: jest.fn(req => req),
      },
    };
    return resolveResponse({ path: '/squawk' }, {}, mock, resolver).then(() => {
      expect(mock.response.body).toHaveBeenCalledWith({
        path: '/squawk',
        params: { ahoy: 'squawk' },
      });
    });
  });

  it('does not set params', () => {
    const mock = {
      request: {},
      response: {
        body: jest.fn(req => req),
      },
    };
    resolveResponse({}, {}, mock, resolver).then(() => {
      expect(mock.response.body).toHaveBeenCalledWith({});
    });
  });

  it('delays resolving response', () => {
    global.setTimeout = jest.fn(fn => fn());
    const mock = {
      request: {},
      response: {
        body: 'squawk',
        delay: 1234,
      },
    };
    return resolveResponse({}, {}, mock, resolver).then(() => {
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1234);
    });
  });
});