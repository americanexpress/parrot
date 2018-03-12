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
import SettingsWrapped, {
  mapStateToProps,
  mapDispatchToProps,
} from '../../../src/app/components/Settings';
import { setUrl } from '../../../src/app/ducks';

jest.mock('../../../src/app/ducks', () => ({ setUrl: jest.fn() }));
const Settings = SettingsWrapped.WrappedComponent;

describe('Settings', () => {
  it('should render', () => {
    expect(shallow(<Settings url="squawk" setUrl={() => null} />)).toMatchSnapshot();
  });

  it('should setUrl', () => {
    const setUrl = jest.fn();
    const rendered = shallow(<Settings url="squawk" setUrl={setUrl} />);
    rendered.find('input').simulate('blur', { target: { value: 'squawk' } });
    expect(setUrl).toHaveBeenCalledWith('squawk');
  });

  it('should mapStateToProps', () => {
    expect(mapStateToProps({ url: 'squawk' })).toMatchObject({ url: 'squawk' });
  });

  it('should mapDispatchToProps', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).setUrl('squawk');
    expect(dispatch).toHaveBeenCalled();
    expect(setUrl).toHaveBeenCalledWith('squawk');
  });
});
