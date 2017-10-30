import matchMock from '../src/matchMock';
import logger from '../src/utils/Logger';

jest.mock('../src/utils/Logger', () => ({
  info: jest.fn(),
}));

describe('matchMock', () => {
  it('calls mock function that matches', () => {
    const scenario = [jest.fn()];
    matchMock({}, { headersSent: true }, scenario);
    expect(logger.info).toHaveBeenCalled();
  });

  it('calls mock function that does not match', () => {
    const scenario = [jest.fn()];
    matchMock({}, {}, scenario);
    expect(scenario[0]).toHaveBeenCalled();
  });

  it('calls mock request function that matches', () => {
    const scenario = [{ request: jest.fn(() => true) }];
    expect(matchMock({}, {}, scenario)).toEqual(scenario[0]);
  });

  it('does not match mock object', () => {
    const scenario = [{ request: { path: '/squawk', headers: 'ahoy', 'Keep-Alive': 'timeout=5' } }];
    const req = { path: '/squawk', headers: 'matey', 'Keep-Alive': 'timeout=5' };
    expect(matchMock(req, {}, scenario)).toBe(undefined);
  });

  it('matches mock object', () => {
    const scenario = [{ request: { path: '/squawk', headers: 'ahoy', 'Keep-Alive': 'timeout=5' } }];
    const req = { path: '/squawk', headers: 'ahoy', 'Keep-Alive': 'timeout=5' };
    expect(matchMock(req, {}, scenario)).toEqual(scenario[0]);
  });
});
