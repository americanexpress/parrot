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

import ParrotFetch from '../src/ParrotFetch';

jest.mock('parrot-core', () => class {});

describe('ParrotFetch', () => {
  it('should normalize', () => {
    const parrotFetch = new ParrotFetch();
    const normalized = parrotFetch.normalizeRequest('http://www.parrot.com/squawk?ahoy=matey');
    expect(normalized).toMatchObject({
      path: '/squawk',
      query: {
        ahoy: 'matey',
      },
      protocol: 'http:',
      host: 'www.parrot.com',
    });
  });

  it('should resolve to context fetch', () => {
    const input = 'http://www.parrot.com';
    const contextFetch = jest.fn(() => 'ahoy');
    const parrotFetch = new ParrotFetch({}, contextFetch);
    const resolved = parrotFetch.resolver(input)();
    expect(contextFetch).toHaveBeenCalledWith(input, undefined);
    expect(resolved).toBe('ahoy');
  });

  it('should resolve response', () => {
    const input = 'http://www.parrot.com';
    const contextFetch = jest.fn();
    const parrotFetch = new ParrotFetch({}, contextFetch);
    const resolved = parrotFetch.resolver(input)({ body: 'ahoy', status: 200 });
    expect(contextFetch).not.toHaveBeenCalled();
    return resolved.then(data => expect(data).toEqual(expect.any(Response)));
  });
});
