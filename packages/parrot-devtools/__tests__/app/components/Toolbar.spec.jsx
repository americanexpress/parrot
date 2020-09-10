/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
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

import Toolbar from '../../../src/app/components/Toolbar';

describe('Toolbar', () => {
  const setFilterValue = jest.fn();
  const mockProps = {
    filterValue: '',
    setFilterValue,
  };
  it('should render Toolbar component', () => {
    const result = shallow(<Toolbar scenariosData={{ ...mockProps }} />);

    expect(result).toMatchSnapshot();
  });

  it('invokes setFilterValue', () => {
    const result = shallow(<Toolbar scenariosData={{ ...mockProps }} />);

    const event = {
      target: { value: 'abc' },
    };
    result.find('input').simulate('change', event);
    expect(setFilterValue).toHaveBeenCalledWith('abc');
  });

  it('clear button', () => {
    const result = shallow(<Toolbar scenariosData={{ ...mockProps }} />);
    result.find('button').simulate('click');
    expect(setFilterValue).toHaveBeenCalledWith('');
  });
});
