import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import GeneralControls from '../../../src/app/components/plugins/GeneralControls';

describe('GeneralControls component', () => {
  it('renders', () => {
    const props = {
      url: 'http://localhost:8080',
      setUrl: jest.fn(),
      onRefresh: jest.fn(),
    };
    const wrapper = shallow(React.createElement(GeneralControls, props));
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
