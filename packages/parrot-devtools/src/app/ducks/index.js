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

import { DEFAULT_MIDDLEWARE_URL } from '../utils';

export const SET_URL = 'SET_URL';

const initialState = {
  url: DEFAULT_MIDDLEWARE_URL,
};

export default function reducer(state = initialState, { type, url }) {
  switch (type) {
    case SET_URL: {
      return {
        ...state,
        url,
      };
    }
    default: {
      return state;
    }
  }
}

export const setUrl = url => ({
  type: SET_URL,
  url,
});
