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

import Parrot from 'parrot-core';
import parse from 'url-parse';

class ParrotFetch extends Parrot {
  constructor(scenarios, contextFetch) {
    super(scenarios);
    this.contextFetch = contextFetch;
  }

  normalizeRequest = (input, { method = 'GET', ...init } = {}) => {
    const { pathname: path, query, ...parsed } = parse(input, true);
    return {
      ...init,
      ...parsed,
      path,
      query: Object.keys(query) && query,
      method: method && method.toUpperCase(),
    };
  };

  resolver = (input, init) => response => {
    if (!response) {
      return this.contextFetch(input, init);
    }
    const { body, status } = response;
    return Promise.resolve(
      new Response(new Blob([JSON.stringify(body)], { status, type: 'application/json' }))
    );
  };
}

export default ParrotFetch;
