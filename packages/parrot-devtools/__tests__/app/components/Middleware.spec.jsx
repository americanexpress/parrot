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
import MiddlewareWrapped, { mapStateToProps } from '../../../src/app/components/Middleware';

const Middleware = MiddlewareWrapped.WrappedComponent;

const json = jest.fn(() => 'squawk');
global.fetch = jest.fn(() => Promise.resolve({ json }));

describe('Middleware', () => {
  it('should loadScenarios', () => {
    const render = jest.fn(() => null);
    const instance = shallow(<Middleware url="squawk" render={render} />).instance();
    return instance.loadScenarios().then(() => {
      expect(global.fetch).toHaveBeenCalledWith('squawk/parrot/scenarios');
      expect(global.fetch).toHaveBeenCalledWith('squawk/parrot/scenario');
      expect(json).toHaveBeenCalledTimes(4);
      expect(render).toHaveBeenCalledWith(
        {
          scenarios: 'squawk',
          scenario: 'squawk',
          setScenario: expect.any(Function),
          loadScenarios: expect.any(Function),
        },
        false
      );
    });
  });

  it('should loadScenarios if the URL changes', () => {
    global.fetch.mockClear();
    const rendered = shallow(<Middleware url="squawk" render={() => null} />);
    rendered.setProps({ url: 'parrot' });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should not loadScenarios if the does not change', () => {
    global.fetch.mockClear();
    const rendered = shallow(<Middleware url="squawk" render={() => null} />);
    rendered.setProps({ url: 'squawk' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle loadScenarios failure', () => {
    global.fetch = jest.fn(() => Promise.reject());
    const render = jest.fn(() => null);
    const instance = shallow(<Middleware url="squawk" render={render} />).instance();
    return instance.loadScenarios().then(() => {
      expect(global.fetch).toHaveBeenCalledWith('squawk/parrot/scenarios');
      expect(render).toHaveBeenCalledWith(
        {
          scenarios: undefined,
          scenario: undefined,
          setScenario: expect.any(Function),
          loadScenarios: expect.any(Function),
        },
        false
      );
    });
  });

  it('should setScenario', () => {
    global.chrome = false;
    global.fetch = jest.fn(() => Promise.resolve({ json }));
    const instance = shallow(<Middleware url="squawk" render={() => null} />).instance();
    return instance.setScenario('squawk').then(() => {
      expect(global.fetch).toHaveBeenCalledWith('squawk/parrot/scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: 'squawk',
        }),
      });
    });
  });

  it('should setScenario and refresh window in chrome', () => {
    global.chrome = {
      devtools: {
        inspectedWindow: {
          reload: jest.fn(),
        },
      },
    };
    const instance = shallow(<Middleware url="squawk" render={() => null} />).instance();
    return instance.setScenario('squawk').then(() => {
      expect(global.chrome.devtools.inspectedWindow.reload).toHaveBeenCalledWith(null);
    });
  });

  it('should mapStateToProps', () => {
    expect(mapStateToProps({ url: 'squawk' })).toMatchObject({ url: 'squawk' });
  });
});
