import React from 'react';
import { shallow } from 'enzyme';

import DevTools from '../../../src/app/components/DevTools';

jest.mock('../../../src/app/utils/fetchApi');

describe('DevTools component', () => {
  it('renders', () => {
    const wrapper = shallow(<DevTools />);
    expect(wrapper).toMatchSnapshot();
  });
});
