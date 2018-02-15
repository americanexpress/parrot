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

import React from 'react';
import { shallow } from 'enzyme';
import ScenarioSelector from '../../../src/app/components/ScenarioSelector';

describe('ScenarioSelector', () => {
  it('should render loading', () => {
    expect(
      shallow(
        <ScenarioSelector
          data={{ setScenario: () => null, loadScenarios: () => null }}
          loading={true}
        />
      )
    ).toMatchSnapshot();
  });

  it('should render error', () => {
    expect(
      shallow(
        <ScenarioSelector
          data={{ scenarios: [], setScenario: () => null, loadScenarios: () => null }}
          loading={false}
        />
      )
    ).toMatchSnapshot();
  });

  it('should render scenarios', () => {
    expect(
      shallow(
        <ScenarioSelector
          data={{
            scenarios: [{ name: 'squawk' }],
            scenario: 'squawk',
            setScenario: () => null,
            loadScenarios: () => null,
          }}
          loading={false}
        />
      )
    ).toMatchSnapshot();
  });

  it('should setScenario', () => {
    const setScenario = jest.fn();
    const rendered = shallow(
      <ScenarioSelector
        data={{
          scenarios: [{ name: 'squawk' }],
          scenario: 'squawk',
          setScenario,
          loadScenarios: () => null,
        }}
        loading={false}
      />
    );

    rendered.find('a').simulate('click');
    expect(setScenario).toHaveBeenCalledWith('squawk');
  });
});
