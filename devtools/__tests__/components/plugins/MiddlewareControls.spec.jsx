import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import MiddlewareControls from '../../../src/app/components/plugins/MiddlewareControls';

jest.mock('../../../src/app/utils/fetchApi');

describe('MiddlewareControls component', () => {
  it('renders', () => {
    const props = {
      url: 'http://localhost:8080',
    };
    const wrapper = shallow(React.createElement(MiddlewareControls, props));
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
