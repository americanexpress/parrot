import { describe as parrotDescribe, it as parrotIt, get } from '../src';

describe('describe', () => {
  it('calls function passed and returns scenarios', () => {
    const block = jest.fn();
    const scenarios = parrotDescribe('squawk', block);
    expect(scenarios).toEqual({});
    expect(block).toHaveBeenCalled();
  });
});

describe('it', () => {
  it('calls function passed', () => {
    const block = jest.fn();
    parrotIt('squawk', block);
    expect(block).toHaveBeenCalled();
  });
});

describe('created method', () => {
  it('returns mock', () => {
    const mock = get('/polly/wanna/cracker');
    expect(mock).toMatchObject({
      structure: expect.any(Object),
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });
});
