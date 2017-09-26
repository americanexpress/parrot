import React from 'react';
import { shallow } from 'enzyme';

import GeneralControls from '../../../../src/app/components/plugins/GeneralControls';

describe('GeneralControls component', () => {
  it('renders', () => {
    const props = {
      url: 'http://localhost:8080',
      setUrl: jest.fn(),
      onRefresh: jest.fn(),
    };
    const wrapper = shallow(<GeneralControls {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
