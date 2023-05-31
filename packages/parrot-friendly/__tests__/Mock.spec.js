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

import Mock from '../src/Mock';

describe('Mock', () => {
  it('creates initial mock structure', () => {
    const mock = new Mock('ahoy');
    expect(mock.structure).toEqual('ahoy');
  });

  it('adds query', () => {
    const mock = new Mock({ request: {} });
    mock.query('ahoy');
    expect(mock.structure).toEqual({
      request: {
        query: 'ahoy',
      },
    });
  });

  it('adds headers', () => {
    const mock = new Mock({ request: {} });
    mock.headers('ahoy');
    expect(mock.structure).toEqual({
      request: {
        headers: 'ahoy',
      },
    });
  });

  it('adds body', () => {
    const mock = new Mock({ response: {} });
    mock.response('ahoy');
    expect(mock.structure).toEqual({
      response: {
        body: 'ahoy',
      },
    });
  });

  it('adds data', () => {
    const mock = new Mock({ response: {} });
    mock.data('partial success');
    expect(mock.structure).toEqual({
      response: {
        data: 'partial success',
      },
    });
  });

  it('adds errors', () => {
    const mock = new Mock({ response: {} });
    mock.errors('ahoy');
    expect(mock.structure).toEqual({
      response: {
        errors: 'ahoy',
      },
    });
  });

  it('adds delay', () => {
    const mock = new Mock({ response: {} });
    mock.delay('ahoy');
    expect(mock.structure).toEqual({
      response: {
        delay: 'ahoy',
      },
    });
  });

  it('adds status', () => {
    const mock = new Mock({ response: {} });
    mock.status('ahoy');
    expect(mock.structure).toEqual({
      response: {
        status: 'ahoy',
      },
    });
  });
});
