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

import util from 'util';
import isEqual from 'lodash/isEqual';
import pathToRegexp from 'path-to-regexp';
import logger from './logger';

function match(normalizedRequest) {
  return request =>
    Object.keys(request).every(property => {
      if (property === 'path') {
        return pathToRegexp(request.path).exec(normalizedRequest.path);
      } else if (property === 'headers') {
        return Object.keys(request.headers).every(
          key => request.headers[key] === normalizedRequest.headers[key]
        );
      }

      return isEqual(normalizedRequest[property], request[property]);
    });
}

export default function matchMock(normalizedRequest, platformRequest, mocks) {
  let matchedMock;
  for (let index = 0; index < mocks.length; index += 1) {
    const mock = mocks[index];
    if (typeof mock === 'function') {
      const response = mock(normalizedRequest, match(normalizedRequest), ...platformRequest);
      if (response) {
        matchedMock = { response };
        logger.info('Matched mock function.', normalizedRequest.path);
        break;
      }
    } else if (
      typeof mock.request === 'function' &&
      mock.request(normalizedRequest, match(normalizedRequest))
    ) {
      logger.info('Matched request function.', normalizedRequest.path);
      matchedMock = mock;
      break;
    } else if (typeof mock.request === 'object' && match(normalizedRequest)(mock.request)) {
      logger.info(
        `Matched request object: ${util.inspect(mock.request, {
          colors: true,
          breakLength: Infinity,
        })}`,
        normalizedRequest.path
      );
      matchedMock = mock;
      break;
    }
  }

  return matchedMock;
}
