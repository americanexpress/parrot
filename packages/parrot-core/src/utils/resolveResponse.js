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

// eslint-disable-next-line max-params
export default async function resolveResponse(normalizedRequest, platformRequest, mock, resolver) {
  if (!mock) {
    return resolver();
  }

  const { request: { path } = {}, response } = mock;
  const { body, status, delay } = await response;
  const resolvedResponse = { status };

  const requestWithParams = path
    ? {
        ...normalizedRequest,
        params: getParams(normalizedRequest.path, path),
        // headers are lazily computed using accessor in node >15.1.0
        headers: normalizedRequest.headers,
      }
    : normalizedRequest;

  if (typeof body === 'function') {
    resolvedResponse.body = await body(requestWithParams, ...[].concat(platformRequest));
  } else {
    resolvedResponse.body = await body;
  }

  if (delay) {
    return new Promise(resolve => setTimeout(() => resolve(resolver(resolvedResponse)), delay));
  }
  return Promise.resolve(resolver(resolvedResponse));
}
