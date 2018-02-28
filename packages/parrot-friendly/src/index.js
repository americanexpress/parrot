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

import parrotGraphql from 'parrot-graphql';
import Mock from './Mock';

let scenarios = {};
let scenario;

function createMethod(method) {
  return path => {
    const initialMock = new Mock({
      request: {
        method,
        path,
      },
      response: {},
    });
    scenario.push(initialMock.structure);
    return initialMock;
  };
}

export const get = createMethod('GET');
export const head = createMethod('HEAD');
export const post = createMethod('POST');
export const put = createMethod('PUT');
export const del = createMethod('DELETE');
export const connect = createMethod('CONNECT');
export const options = createMethod('OPTIONS');
export const patch = createMethod('PATCH');

export function mock(structure) {
  const initialMock = new Mock(structure);
  scenario.push(initialMock.structure);
  return initialMock;
}

export function request(structure) {
  const initialMock = new Mock({
    request: structure,
    response: {},
  });
  scenario.push(initialMock.structure);
  return initialMock;
}

export function graphql(path, schema, mocks) {
  const initialMock = new Mock(parrotGraphql(path, schema, mocks));
  scenario.push(initialMock.structure);
  return initialMock;
}

export function describe(name, block) {
  scenarios = {};
  block();
  return scenarios;
}

export function it(name, block) {
  scenarios[name] = [];
  scenario = scenarios[name];
  block();
}
