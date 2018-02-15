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

import getParams from './getParams';

export default async function resolveResponse(normalizedRequest, platformRequest, mock, resolver) {
  if (!mock) {
    return resolver();
  }

  const { request: { path } = {}, response: { body, status, delay } } = mock;
  const response = { status };

  const requestWithParams = path
    ? { ...normalizedRequest, params: getParams(normalizedRequest.path, path) }
    : normalizedRequest;

  if (typeof body === 'function') {
    response.body = await body(requestWithParams, ...platformRequest);
  } else {
    response.body = await body;
  }

  if (delay) {
    return new Promise(resolve => setTimeout(() => resolve(resolver(response)), delay));
  }
  return Promise.resolve(resolver(response));
}
