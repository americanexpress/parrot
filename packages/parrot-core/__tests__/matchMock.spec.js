import { matchMock, logger } from '../src';

jest.mock('../src/utils/logger', () => ({
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
    const scenario = [{ request: { path: '/squawk', headers: 'ahoy' } }];
    const req = { path: '/squawk', headers: 'matey' };
    expect(matchMock(req, {}, scenario)).toBe(undefined);
  });

  it('matches mock object', () => {
    const scenario = [{ request: { path: '/squawk', headers: 'ahoy' } }];
    const req = { path: '/squawk', headers: 'ahoy' };
    expect(matchMock(req, {}, scenario)).toEqual(scenario[0]);
  });
});
