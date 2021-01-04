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

const { mockServer } = require('@graphql-tools/mock');

module.exports = function graphql(path, schema, mocks) {
  const server = mockServer(schema, mocks);
  return {
    request: ({ method }, match) => match({ path }) && (method === 'GET' || method === 'POST'),
    response: {
      body: ({ method, query: queryString, body }) => {
        const { query, variables } = method === 'GET' ? queryString : body;
        return server.query(query, variables);
      },
    },
  };
};
