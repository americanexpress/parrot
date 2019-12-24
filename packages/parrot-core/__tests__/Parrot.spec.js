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

import Parrot from '../src';
import { logger, matchMock, normalizeScenarios, resolveResponse } from '../src/utils';

jest.mock('../src/utils', () => ({
  logger: {
    setScenario: jest.fn(),
  },
  matchMock: jest.fn(),
  normalizeScenarios: jest.fn(scenarios => scenarios),
  resolveResponse: jest.fn(),
}));

class ParrotTest extends Parrot {
  normalizeRequest = jest.fn();

  resolver = jest.fn();
}

describe('Parrot', () => {
  it('normalizes scenarios and sets logger', () => {
    new ParrotTest(); // eslint-disable-line no-new
    expect(normalizeScenarios).toHaveBeenCalledWith({});
    expect(logger.setScenario).toHaveBeenCalledWith(undefined);
  });

  it('should get the active scenario name', () => {
    const scenarios = { ahoy: [] };
    const parrotTest = new ParrotTest(scenarios);
    expect(parrotTest.getActiveScenario()).toBe('ahoy');
  });

  it('should set the active scenario name', () => {
    const parrotTest = new ParrotTest();
    parrotTest.setActiveScenario('ahoy');
    expect(parrotTest.activeScenario).toBe('ahoy');
  });

  it('should get scenarios', () => {
    const scenarios = { ahoy: [] };
    const parrotTest = new ParrotTest(scenarios);
    expect(parrotTest.getScenarios()).toEqual([{ name: 'ahoy', mocks: [] }]);
  });

  it('should set scenarios', () => {
    const parrotTest = new ParrotTest();
    const scenarios = { ahoy: [] };
    parrotTest.setScenarios(scenarios);
    expect(normalizeScenarios).toHaveBeenCalledWith(scenarios);
    expect(parrotTest.scenarios).toEqual({ ahoy: [] });
  });

  it('should get scenario', () => {
    const scenarios = { ahoy: [] };
    const parrotTest = new ParrotTest(scenarios);
    expect(parrotTest.getScenario('ahoy')).toEqual([]);
  });

  it('should set scenario', () => {
    const scenarios = { ahoy: [] };
    const parrotTest = new ParrotTest(scenarios);
    parrotTest.setScenario('ahoy', 'squawk');
    expect(parrotTest.scenarios.ahoy).toBe('squawk');
  });

  it('should get mock', () => {
    const scenarios = {
      ahoy: ['squawk'],
    };
    const parrotTest = new ParrotTest(scenarios);
    expect(parrotTest.getMock('ahoy', 0)).toBe('squawk');
  });

  it('should set mock', () => {
    const scenarios = {
      ahoy: ['squawk'],
    };
    const parrotTest = new ParrotTest(scenarios);
    parrotTest.setMock('ahoy', 0, 'polly');
    expect(parrotTest.scenarios.ahoy[0]).toBe('polly');
  });

  it('should resolve mock', () => {
    const scenarios = { ahoy: [] };
    const parrotTest = new ParrotTest(scenarios);
    return parrotTest.resolve().then(() => {
      expect(parrotTest.normalizeRequest).toHaveBeenCalled();
      expect(parrotTest.resolver).toHaveBeenCalled();
      expect(matchMock).toHaveBeenCalled();
      expect(resolveResponse).toHaveBeenCalled();
    });
  });
});
