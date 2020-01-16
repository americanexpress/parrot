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

import React from 'react';
import { shallow } from 'enzyme';

import { ScenariosMiddleware, mapStateToProps } from '../../../src/app/components/Scenarios';
import useScenarios from '../../../src/app/hooks/useScenarios';

jest.mock('../../../src/app/hooks/useScenarios', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    loading: false,
    scenario: '',
    scenarios: [],
    setScenario: jest.fn(() => Promise.resolve()),
    loadScenarios: jest.fn(() => Promise.resolve()),
  })),
}));

describe('Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should mapStateToProps', () => {
    expect(mapStateToProps({ url: 'squawk' })).toMatchObject({ url: 'squawk' });
  });

  describe('ScenariosMiddleware', () => {
    const url = 'https://dev.example.com/squawk';

    it('should render scenarios middleware component', () => {
      const scenario = 'api-fetch';
      const setScenario = jest.fn(() => Promise.resolve());

      useScenarios.mockImplementationOnce(() => ({
        scenario,
        setScenario,
        loading: false,
        scenarios: [{ name: scenario }],
        loadScenarios: jest.fn(() => Promise.resolve()),
      }));

      const result = shallow(<ScenariosMiddleware url={url} />);

      expect(useScenarios).toHaveBeenCalledTimes(1);
      expect(useScenarios).toHaveBeenCalledWith(url);
      expect(result).toMatchSnapshot();

      result.find('button').simulate('click');
      expect(setScenario).toHaveBeenCalledWith(scenario);
    });

    it('should loading state', () => {
      useScenarios.mockImplementationOnce(() => ({
        loading: true,
      }));

      const result = shallow(<ScenariosMiddleware url={url} />);

      expect(useScenarios).toHaveBeenCalledTimes(1);
      expect(useScenarios).toHaveBeenCalledWith(url);
      expect(result).toMatchSnapshot();
    });

    it('should inform the user of failure', () => {
      useScenarios.mockImplementationOnce(() => ({
        loading: false,
        scenario: '',
        scenarios: [],
      }));

      const result = shallow(<ScenariosMiddleware url={url} />);

      expect(useScenarios).toHaveBeenCalledTimes(1);
      expect(useScenarios).toHaveBeenCalledWith(url);
      expect(result).toMatchSnapshot();
    });
  });
});
