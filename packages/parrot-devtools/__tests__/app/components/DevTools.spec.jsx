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

import DevTools from '../../../src/app/components/DevTools';
import useDevTools from '../../../src/app/hooks/useDevTools';

jest.mock('../../../src/app/hooks/useDevTools');

describe('DevTools component', () => {
  it('renders selector when true', () => {
    expect.assertions(1);

    useDevTools.mockImplementationOnce(() => ({ showSettings: true }));

    const rendered = shallow(<DevTools />);

    expect(rendered).toMatchSnapshot();
  });

  it('hides settings when false', () => {
    expect.assertions(1);

    useDevTools.mockImplementationOnce(() => ({ showSettings: false }));

    const rendered = shallow(<DevTools />);

    expect(rendered).toMatchSnapshot();
  });

  it('calls toggleSettings when button is clicked', () => {
    expect.assertions(1);

    const toggleSettings = jest.fn();
    useDevTools.mockImplementationOnce(() => ({ showSettings: false, toggleSettings }));

    const rendered = shallow(<DevTools />);
    rendered.find('button').simulate('click');

    expect(toggleSettings).toHaveBeenCalledTimes(1);
  });
});
