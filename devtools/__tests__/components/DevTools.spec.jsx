import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import DevTools from '../../src/app/components/DevTools';

jest.mock('../../src/app/utils/fetchApi');

describe('DevTools component', () => {
  it('renders', () => {
    const wrapper = shallow(React.createElement(DevTools, {}));
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
