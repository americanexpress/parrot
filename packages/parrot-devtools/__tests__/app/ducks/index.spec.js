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

import reducer, { setUrl, SET_URL } from '../../../src/app/ducks';
import { DEFAULT_MIDDLEWARE_URL } from '../../../src/app/utils';

describe('ducks', () => {
  it('should create SET_URL action', () => {
    expect(setUrl('squawk')).toMatchObject({
      type: SET_URL,
      url: 'squawk',
    });
  });

  it('should return state with URL', () => {
    expect(reducer({}, { type: SET_URL, url: 'squawk' })).toMatchObject({ url: 'squawk' });
  });

  it('should return state untouched', () => {
    expect(reducer(undefined, {})).toMatchObject({ url: DEFAULT_MIDDLEWARE_URL });
  });
});
