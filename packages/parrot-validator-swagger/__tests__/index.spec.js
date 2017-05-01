import swaggerIndex from '../src/index';
import registerMiddleware from 'parrot-registry';

jest.mock('parrot-registry');
jest.mock('../src/validatorMiddleware');

describe('Spec: swagger validator index', () => {
  const config = { swaggerModel: {} };
  it('returns a function', () => {
    expect(typeof swaggerIndex(config)).toEqual('function');
  });
  it('registers the middleware', async () => {
    const app = { use: jest.fn() };
    await swaggerIndex(config)(app);
    expect(registerMiddleware).toHaveBeenCalledWith(app, { name: 'parrot-validator-swagger' });
  });
});
