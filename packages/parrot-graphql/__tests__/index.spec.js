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

import graphql from '../src';

jest.mock('@graphql-tools/mock', () => ({
  mockServer: () => ({
    query: query => query,
  }),
}));

describe('parrot-graphql', () => {
  it('matches a GET request', () => {
    const match = jest.fn(() => true);
    const { request } = graphql();
    expect(request({ method: 'GET' }, match)).toBe(true);
  });

  it('matches a POST request', () => {
    const match = jest.fn(() => true);
    const { request } = graphql();
    expect(request({ method: 'POST' }, match)).toBe(true);
  });

  it('gets query from query string', () => {
    const { body } = graphql().response;
    expect(body({ method: 'GET', query: { query: 'squawk' } })).toBe('squawk');
  });

  it('gets query from body', () => {
    const { body } = graphql().response;
    expect(body({ method: 'POST', body: { query: 'squawk' } })).toBe('squawk');
  });
});
