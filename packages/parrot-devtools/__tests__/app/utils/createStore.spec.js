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

import { createLocalStorageStore, getLocalStorage, setLocalStorage } from '../../../src/app/utils';

jest.mock('../../../src/app/utils/localStorage');
jest.mock('redux', () => ({
  createStore: () => ({ subscribe: fn => fn(), getState: () => null }),
}));

describe('createStore', () => {
  it('reads and writes localStorage', () => {
    createLocalStorageStore();
    expect(getLocalStorage).toHaveBeenCalled();
    expect(setLocalStorage).toHaveBeenCalled();
  });
});
