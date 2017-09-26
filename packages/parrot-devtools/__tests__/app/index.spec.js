import ReactDOM from 'react-dom';
import '../../src/app';

jest.mock('react-dom');

describe('Initializes App', () => {
  it('renders app', () => {
    expect(ReactDOM.render).toHaveBeenCalled();
  });
});
