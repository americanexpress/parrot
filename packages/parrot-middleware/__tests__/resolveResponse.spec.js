import resolveResponse from '../src/resolveResponse';

jest.useFakeTimers();

describe('resolveResponse', () => {
  let res;
  beforeEach(() => {
    res = {
      status: jest.fn(),
      json: jest.fn(),
      send: jest.fn(),
    };
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
    resolveResponse({ path: '/squawk' }, res, mock);
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
    resolveResponse({}, res, mock);
    expect(mock.response.resource).toHaveBeenCalledWith({});
  });

  it('calls resource and responds', () => {
    const mock = {
      request: {},
      response: {
        resource: (req, response) => `${req}${response}`,
      },
    };
    resolveResponse({}, res, mock);
    expect(res.status).not.toHaveBeenCalled();
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
    resolveResponse({}, res, mock);
    expect(res.json).toHaveBeenCalledWith({
      ahoy: 'squawk',
    });
  });

  it('sends resource', () => {
    const mock = {
      request: {},
      response: {
        resource: 'squawk',
      },
    };
    resolveResponse({}, res, mock);
    expect(res.send).toHaveBeenCalledWith('squawk');
  });

  it('sends delays', () => {
    const mock = {
      request: {},
      response: {
        resource: 'squawk',
        delay: 500,
      },
    };
    resolveResponse({}, res, mock);
    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(500);
    jest.runAllTimers();
    expect(res.send).toHaveBeenCalledWith('squawk');
  });
});
