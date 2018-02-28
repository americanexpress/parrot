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

import { describe as parrotDescribe, it as parrotIt, get, mock, request, graphql } from '../src';

jest.mock('parrot-graphql', () => () => 'squawk');

describe('Friendly methods', () => {
  it('describe calls function passed and returns scenarios', () => {
    const block = jest.fn();
    const scenarios = parrotDescribe('squawk', block);
    expect(scenarios).toEqual({});
    expect(block).toHaveBeenCalled();
  });

  it('it calls function passed', () => {
    const block = jest.fn();
    parrotIt('squawk', block);
    expect(block).toHaveBeenCalled();
  });

  it('HTTP methods return mock object', () => {
    const createdMock = get('/polly/wanna/cracker');
    expect(createdMock).toMatchObject({
      structure: expect.any(Object),
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });

  it('mock returns mock object', () => {
    const createdMock = mock('squawk');
    expect(createdMock).toMatchObject({
      structure: 'squawk',
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });

  it('request returns mock object', () => {
    const createdMock = request('squawk');
    expect(createdMock).toMatchObject({
      structure: {
        request: 'squawk',
        response: {},
      },
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });

  it('graphql returns parrotGraphql function', () => {
    const createdMock = graphql();
    expect(createdMock).toMatchObject({
      structure: 'squawk',
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });
});
