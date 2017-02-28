import validator from '../src/index';

jest.mock('../src/loadSwagger');
jest.mock('../src/validateSwagger');

describe('Spec: index', () => {
  let loadSwagger;
  let validateSwagger;
  let mockResponse;
  let config;
  beforeEach(() => {
    loadSwagger = require('../src/loadSwagger');
    loadSwagger.default = jest.fn(() => Promise.resolve());
    validateSwagger = require('../src/validateSwagger');
    validateSwagger.default = jest.fn(() => Promise.resolve());
    mockResponse = {
      mock: 'something',
    };
    config = {
      request: {
        path: '/test',
        method: 'get'
      },
      response: {
        statusCode: 200
      }
    };
  });

  it('calls loadSwagger', () => {
    validator(mockResponse, config);
    expect(loadSwagger.default).toHaveBeenCalled();
  });

  it('sets default statusCode if not set', async () => {
    config.response.statusCode = undefined;
    await validator(mockResponse, config);
    expect(validateSwagger.default.mock.calls[0][4]).toEqual(200);
  });

  it('calls validateSwagger', async () => {
    await validator(mockResponse, config);
    expect(validateSwagger.default).toHaveBeenCalled();
  });

  it('returns invalid object if error thrown during validation', async () => {
    const err = new Error('Failed');
    validateSwagger.default = jest.fn(() => { throw err; });
    const result =  await validator(mockResponse, config);
    expect(result).toEqual({
      valid: false,
      errors: err
    });
  });
});
