import * as API from '../src';

describe('API', () => {
  it('exports correct API', () => {
    expect(API).toMatchSnapshot();
  });
});
