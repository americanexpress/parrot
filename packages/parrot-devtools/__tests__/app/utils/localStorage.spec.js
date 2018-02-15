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

import { getLocalStorage, setLocalStorage } from '../../../src/app/utils';
import { PARROT_STATE } from '../../../src/app/utils';

global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(() => JSON.stringify({ parrot: 'squawk' })),
};

describe('localStorage', () => {
  it('gets serialized value from localStorage', () => {
    const value = getLocalStorage();
    expect(global.localStorage.getItem).toHaveBeenCalledWith(PARROT_STATE);
    expect(value).toMatchObject({ parrot: 'squawk' });
  });

  it('gets undefined if key not in localStorage', () => {
    global.localStorage.getItem = jest.fn(() => null);
    const value = getLocalStorage();
    expect(global.localStorage.getItem).toHaveBeenCalledWith(PARROT_STATE);
    expect(value).toBeUndefined();
  });

  it('sets serialized value in localStorage', () => {
    const value = { parrot: 'squawk' };
    const serlialzed = JSON.stringify(value);
    setLocalStorage(value);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(PARROT_STATE, serlialzed);
  });
});
