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

import { normalizeScenarios, matchMock, resolveResponse, logger } from './utils';

class Parrot {
  constructor(scenarios = {}, utils) {
    this.normalizeScenarios = utils.normalizeScenarios || normalizeScenarios;
    this.matchMock = utils.matchMock || matchMock;
    this.resolveResponse = utils.resolveResponse || resolveResponse;

    this.scenarios = this.normalizeScenarios(scenarios);
    [this.activeScenario] = Object.keys(scenarios);
    logger.setScenario(this.activeScenario);
  }

  getActiveScenario = () => this.activeScenario;

  setActiveScenario = name => {
    this.activeScenario = name;
    logger.setScenario(name);
  };

  getScenarios = () =>
    Object.keys(this.scenarios).map(name => ({ name, mocks: this.scenarios[name] }));

  setScenarios = scenarios => {
    this.scenarios = this.normalizeScenarios(scenarios);
  };

  getScenario = name => this.scenarios[name];

  setScenario = (name, mocks) => {
    const scenarios = { [name]: mocks };
    this.scenarios = {
      ...this.scenarios,
      ...this.normalizeScenarios(scenarios),
    };
  };

  getMock = (name, index) => this.scenarios[name][index];

  setMock = (name, index, mock) => {
    this.scenarios[name][index] = mock;
  };

  resolve = async (...platformRequest) => {
    const normalizedRequest = this.normalizeRequest(...platformRequest);
    const resolver = this.resolver(...platformRequest);
    const mocks = this.scenarios[this.activeScenario];
    const mock = await this.matchMock(normalizedRequest, platformRequest, mocks);
    return this.resolveResponse(normalizedRequest, platformRequest, mock, resolver);
  };
}

export default Parrot;
