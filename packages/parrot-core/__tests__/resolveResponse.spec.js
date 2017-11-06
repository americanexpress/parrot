import { resolveResponse } from '../src';

describe('resolveResponse', () => {
  let resolver;
  beforeEach(() => {
    resolver = jest.fn();
  });

  it('sets params', () => {
    const mock = {
      request: {
        path: '/:ahoy',
      },
      response: {
        resource: jest.fn(req => req),
      },
    };
    resolveResponse({ path: '/squawk' }, {}, mock, resolver);
    expect(mock.response.resource).toHaveBeenCalledWith({
      path: '/squawk',
      params: { ahoy: 'squawk' },
    });
  });

  it('does not set params', () => {
    const mock = {
      request: {},
      response: {
        resource: jest.fn(req => req),
      },
    };
    resolveResponse({}, {}, mock, resolver);
    expect(mock.response.resource).toHaveBeenCalledWith({});
  });

  it('calls resource and responds', () => {
    const mock = {
      request: {},
      response: {
        resource: (req, response) => `${req}${response}`,
      },
    };
    resolveResponse({}, {}, mock, resolver);
    expect(resolver).not.toHaveBeenCalled();
  });

  it('sends resource object', () => {
    const mock = {
      request: {},
      response: {
        resource: {
          ahoy: 'squawk',
        },
      },
    };
    resolveResponse({}, {}, mock, resolver);
    expect(resolver).toHaveBeenCalledWith(
      {
        ahoy: 'squawk',
      },
      undefined,
      undefined
    );
  });

  it('sends resource', () => {
    const mock = {
      request: {},
      response: {
        resource: 'squawk',
      },
    };
    resolveResponse({}, {}, mock, resolver);
    expect(resolver).toHaveBeenCalledWith('squawk', undefined, undefined);
  });
});
