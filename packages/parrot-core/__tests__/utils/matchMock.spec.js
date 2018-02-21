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

import { matchMock, logger } from '../../src/utils';

jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
}));

describe('matchMock', () => {
  it('calls mock function that does not match', () => {
    const mocks = [jest.fn(() => false)];
    matchMock({}, {}, mocks);
    expect(mocks[0]).toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('calls mock function that matches', () => {
    const mocks = [jest.fn(() => true)];
    matchMock({}, {}, mocks);
    expect(logger.info).toHaveBeenCalled();
  });

  it('calls mock request function that matches', () => {
    const mocks = [{ request: jest.fn(() => true) }];
    expect(matchMock({}, {}, mocks)).toEqual(mocks[0]);
  });

  it('does not match mock object', () => {
    const mocks = [{ request: { path: '/squawk', headers: 'ahoy', 'Keep-Alive': 'timeout=5' } }];
    const req = { path: '/squawk', headers: 'matey', 'Keep-Alive': 'timeout=5' };
    expect(matchMock(req, {}, mocks)).toBe(undefined);
  });

  it('matches mock object', () => {
    const mocks = [{ request: { path: '/squawk', headers: 'ahoy', 'Keep-Alive': 'timeout=5' } }];
    const req = { path: '/squawk', headers: 'ahoy', 'Keep-Alive': 'timeout=5' };
    expect(matchMock(req, {}, mocks)).toEqual(mocks[0]);
  });
});
