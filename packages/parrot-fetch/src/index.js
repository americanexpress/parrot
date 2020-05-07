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

import ParrotFetch from './ParrotFetch';

/* istanbul ignore next */
const context = typeof global === 'undefined' ? self : global; // eslint-disable-line no-restricted-globals
const contextFetch = context.fetch.bind(context);
export const PARROT_STATE = 'PARROT_STATE';

export default function init(scenarios, fetchWrapperParam) {
  const fetchWrapper = fetchWrapperParam;
  let parrotFetch;
  // option to mock a fetchClient that is different from the global fetch by passing the fetchClient in through a fetchWrapper object.
  if (fetchWrapper) {
    parrotFetch = new ParrotFetch(scenarios, contextFetch);
    fetchWrapper.fetchClient = parrotFetch.resolve;
  } else {
    parrotFetch = new ParrotFetch(scenarios, contextFetch);
    context.fetch = parrotFetch.resolve;
  }
  return parrotFetch;
}
