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

import { normalizeScenarios } from '../../src/utils';

describe('normalizeScenarios', () => {
  it('normalizes scenarios array', () => {
    const scenarios = [
      {
        name: 'default',
        mocks: [
          {
            request: 'squawk',
            response: 'squawk',
          },
        ],
      },
    ];
    const { default: [{ request: { path }, response: { body } }] } = normalizeScenarios(scenarios);
    expect(path).toEqual(scenarios[0].mocks[0].request);
    expect(body).toEqual(scenarios[0].mocks[0].response);
  });

  it('normalizes scenarios object', () => {
    const scenarios = {
      default: [
        {
          request: 'squawk',
          response: {
            body: 'squawk',
            delay: 123,
          },
        },
      ],
    };
    const { default: [{ request: { path }, response: { body } }] } = normalizeScenarios(scenarios);
    expect(path).toEqual(scenarios.default[0].request);
    expect(body).toEqual(scenarios.default[0].response.body);
  });

  it('does not throw an error for correct mock object', () => {
    const scenarios = {
      default: [
        {
          request: {
            path: 'squawk',
            method: 'GET',
          },
          response: {
            body: 'squawk',
            status: 200,
          },
        },
      ],
    };
    const { default: [{ request, response }] } = normalizeScenarios(scenarios);
    expect(request).toEqual(scenarios.default[0].request);
    expect(response).toEqual({ ...scenarios.default[0].response, status: 200 });
  });

  it('throws an error for incorrect mock object', () => {
    const scenarios = {
      default: [{}],
    };
    expect(() => normalizeScenarios(scenarios)).toThrow();
  });

  it('does not throw an error for mock function', () => {
    const scenarios = { default: [() => null] };
    const { default: defaultScenario } = normalizeScenarios(scenarios);
    expect(defaultScenario).toEqual(scenarios.default);
  });
});
