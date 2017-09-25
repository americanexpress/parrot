import { describe as parrotDescribe, it as parrotIt, get, mock, request } from '../src';

describe('Friendly methods', () => {
  it('describe calls function passed and returns scenarios', () => {
    const block = jest.fn();
    const scenarios = parrotDescribe('squawk', block);
    expect(scenarios).toEqual({});
    expect(block).toHaveBeenCalled();
  });

  it('it calls function passed', () => {
    const block = jest.fn();
    parrotIt('squawk', block);
    expect(block).toHaveBeenCalled();
  });

  it('HTTP methods return mock object', () => {
    const createdMock = get('/polly/wanna/cracker');
    expect(createdMock).toMatchObject({
      structure: expect.any(Object),
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });

  it('mock returns mock object', () => {
    const createdMock = mock('squawk');
    expect(createdMock).toMatchObject({
      structure: 'squawk',
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });

  it('request returns mock object', () => {
    const createdMock = request('squawk');
    expect(createdMock).toMatchObject({
      structure: {
        request: 'squawk',
        response: {},
      },
      query: expect.any(Function),
      headers: expect.any(Function),
      response: expect.any(Function),
      delay: expect.any(Function),
      status: expect.any(Function),
    });
  });
});
