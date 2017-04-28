import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import ListenerControls from '../../../src/app/components/plugins/ListenerControls';

jest.mock('../../../src/app/utils/fetchApi');

describe('ListenerControls component', () => {
  it('renders', () => {
    const props = {
      url: 'http://localhost:8080',
    };
    const wrapper = shallow(React.createElement(ListenerControls, props));
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
