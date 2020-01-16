/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

module.exports = {
  preset: 'amex-jest-preset-react',
  collectCoverageFrom: ['packages/*/src/**/*.{js,jsx}'],
  moduleNameMapper: {
    '\\.png': 'identity-obj-proxy',
    react$: '<rootDir>/node_modules/react',
    'react-dom$': '<rootDir>/node_modules/react-dom',
    'react-test-renderer$': '<rootDir>/node_modules/react-test-renderer',
  },
  setupFiles: ['./jest.setup.js', './packages/parrot-core/jest.setup.js'],
};
