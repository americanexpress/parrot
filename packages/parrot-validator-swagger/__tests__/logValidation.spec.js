import logValidation from '../src/logValidation';

jest.mock('chalk');

describe('Spec: logValidation', () => {
  const outputFn = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('handles having zero errors', () => {
    logValidation({}, outputFn);
    expect(outputFn).toHaveBeenCalledTimes(1);
    expect(outputFn.mock.calls[0][0]).toMatch(/0 error/);
  });

  it('handles having a single error', () => {
    const errors = new Error('test error');
    logValidation({ errors }, outputFn);
    expect(outputFn).toHaveBeenCalledTimes(2);
    expect(outputFn.mock.calls[0][0]).toMatch(/1 error/);
    expect(outputFn.mock.calls[1][0]).toMatch(/test error/);
  });

  it('handles having multiple errors', () => {
    const errors = [Error('test 1'), Error('other error')];
    logValidation({ errors }, outputFn);
    expect(outputFn).toHaveBeenCalledTimes(3);
    expect(outputFn.mock.calls[0][0]).toMatch(/2 error/);
    expect(outputFn.mock.calls[1][0]).toMatch(/test 1/);
    expect(outputFn.mock.calls[2][0]).toMatch(/other error/);
  });
});
