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

function normalizeMock(mock) {
  if (typeof mock !== 'function' && (!mock.request || !mock.response)) {
    throw new Error();
  }

  if (typeof mock === 'function') {
    return mock;
  }

  const { request, response } = mock;

  const normalizedRequest =
    typeof request === 'string' ? { path: request, method: 'GET' } : request;

  let normalizedResponse = response;
  if (!response.status && !response.body && !response.delay) {
    normalizedResponse = {
      status: 200,
      body: response,
    };
  } else if (!response.status) {
    normalizedResponse = {
      status: 200,
      ...response,
    };
  }

  return { request: normalizedRequest, response: normalizedResponse };
}

export default function normalizeScenarios(scenarios) {
  const normalizedContainer = Array.isArray(scenarios)
    ? scenarios.reduce((acc, { name, mocks }) => ({ ...acc, [name]: mocks }), {})
    : scenarios;

  return Object.keys(normalizedContainer).reduce(
    (acc, name) => ({
      ...acc,
      [name]: normalizedContainer[name].map((mock, mockIndex) => {
        try {
          return normalizeMock(mock);
        } catch (err) {
          throw new Error(
            `Mock ${mockIndex} in scenario '${name}' is not an object with keys request and response or a function.`
          );
        }
      }),
    }),
    {}
  );
}
