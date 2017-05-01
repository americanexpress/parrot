import validatorMiddleware from '../src/validatorMiddleware';

jest.mock('../src/validateAgainstSwagger');

describe('Spec: validatorMiddleware', () => {
  let validateSwagger;
  let validatorConfig;
  let req;
  let res;
  let next;

  const mockRunValidator = async (res) => {
    res.write(Buffer.from('{ "model": "test" }'));
    const finishCb = res.on.mock.calls[0][1];
    await finishCb();
  };

  beforeEach(() => {
    validateSwagger = require('../src/validateAgainstSwagger');
    validateSwagger.default = jest.fn(() => ({}));
    validatorConfig = {
      swaggerModel: {},
      matcher: () => true,
      outputFn: jest.fn(),
    };
    req = {};
    res = { write: jest.fn(), on: jest.fn() };
    next = jest.fn();
  });

  it('will skip if matcher is invalid', () => {
    validatorConfig.matcher = () => false;
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.on).not.toHaveBeenCalled();
  });

  it('preserves response writing behavior', () => {
    const originalResWrite = jest.fn();
    res.write = originalResWrite;
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    expect(res.write).not.toEqual(originalResWrite);
    res.write('test write');
    expect(originalResWrite).toHaveBeenCalledWith('test write');
  });

  it('logs out results out validation', async () => {
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    res.write(Buffer.from('{ "model": "test" }'));
    const finishCb = res.on.mock.calls[0][1];
    await finishCb();
    expect(validatorConfig.outputFn).toHaveBeenCalledTimes(1);
  });

  it('can handling using a promise as a swaggerModel', async () => {
    validatorConfig.swaggerModel = Promise.resolve({ success: true });
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    await mockRunValidator(res);
    expect(validatorConfig.outputFn).toHaveBeenCalledTimes(1);
  });

  it('validates request method', async () => {
    req.method = 'POST';
    validatorConfig.swaggerModel = Promise.resolve({ success: true });
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    await mockRunValidator(res);
    expect(validatorConfig.outputFn).toHaveBeenCalledTimes(1);
  });

  it('matches every request by default', async () => {
    delete validatorConfig.matcher;
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    await mockRunValidator(res);
    expect(validatorConfig.outputFn).toHaveBeenCalledTimes(1);
  });

  it('returns invalid object if error thrown during validation', async () => {
    const err = new Error('Failed');
    validateSwagger.default = jest.fn(() => { throw err; });
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    await mockRunValidator(res);
    expect(validatorConfig.outputFn).toHaveBeenCalledWith(
      'Validator failed due to internal error: ', err
    );
  });

  it('defaults output to console log', async () => {
    const err = new Error('Failed');
    validateSwagger.default = jest.fn(() => { throw err; });
    delete validatorConfig.outputFn;
    const validator = validatorMiddleware(validatorConfig);
    validator(req, res, next);
    spyOn(console, 'log');
    await mockRunValidator(res);
    expect(console.log.calls.argsFor(0)[0]).toMatch(/Validator failed due to/);
  });
});
