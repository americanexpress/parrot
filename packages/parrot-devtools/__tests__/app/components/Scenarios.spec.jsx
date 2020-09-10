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

import ScenariosMiddleware from '../../../src/app/components/Scenarios';

describe('Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ScenariosMiddleware', () => {
    it('should render scenarios middleware component', () => {
      const scenario = 'api-fetch';
      const setScenario = jest.fn(() => Promise.resolve());

      const result = shallow(
        <ScenariosMiddleware
          scenariosData={{
            scenario,
            setScenario,
            loading: false,
            filteredScenarios: [{ name: scenario }, { name: 'scenario-2' }],
            loadScenarios: jest.fn(() => Promise.resolve()),
          }}
        />
      );

      expect(result).toMatchSnapshot();

      result
        .find('button')
        .first()
        .simulate('click');
      expect(setScenario).toHaveBeenCalledWith(scenario);
    });

    it('should loading state', () => {
      const result = shallow(<ScenariosMiddleware scenariosData={{ loading: true }} />);

      expect(result).toMatchSnapshot();
    });

    it('should inform the user of failure', () => {
      const result = shallow(
        <ScenariosMiddleware scenariosData={{ loading: false, scenario: '', scenarios: [] }} />
      );

      expect(result).toMatchSnapshot();
    });
  });
});
