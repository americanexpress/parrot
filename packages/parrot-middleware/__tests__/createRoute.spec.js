import LoggerCreator from '../src/utils/logging';
import createRoute from '../src/createRoute';

jest.useFakeTimers();

describe('createRoute', () => {
  let logger;
  let router;
  let mockRes;
  let mockNext;
  beforeEach(() => {
    logger = new LoggerCreator();
    router = {
      get: jest.fn(),
    };
    mockRes = {
      status: jest.fn(),
      send: jest.fn(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  const mockConfig = {
    request: {
      path: '/test',
      method: 'GET',
      params: {},
    },
    response: {
      resource: { success: true }
    }
  };

  it('adds a path to the router', () => {
    createRoute(router, mockConfig, logger);
    expect(router.get).toHaveBeenCalled();
    const [path, callback] = router.get.mock.calls[0];
    expect(path).toEqual(mockConfig.request.path);

    // Test Express Router Callback
    const mockReq = { ...mockConfig.request };
    callback(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(mockConfig.response.resource);
  });

  it('calls next if resolveResponse throws an error', () => {
    createRoute(router, mockConfig, logger);
    expect(router.get).toHaveBeenCalled();
    const [path, callback] = router.get.mock.calls[0];
    expect(path).toEqual(mockConfig.request.path);

    // Test Express Router Callback
    const mockReq = {
      path: '/other',
      params: {},
    };
    callback(mockReq, mockRes, mockNext);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('will delay response if response config has a delay', () => {
    const delay = 2000;
    const mockDelayConfig = {
      ...mockConfig,
      response: {
        delay,
        resource: { success: true }
      }
    };
    createRoute(router, mockDelayConfig, logger);
    expect(router.get).toHaveBeenCalled();
    const [path, callback] = router.get.mock.calls[0];
    expect(path).toEqual(mockDelayConfig.request.path);

    // Test Express Router Callback
    const mockReq = { ...mockDelayConfig.request };
    callback(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(setTimeout.mock.calls[0][1]).toBe(delay);
    jest.runAllTimers();
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('sends text if response resource is not an object', () => {
    const mockTextConfig = {
      ...mockConfig,
      response: {
        resource: 'Hello, world.',
      }
    };
    createRoute(router, mockTextConfig, logger);
    expect(router.get).toHaveBeenCalled();
    const [path, callback] = router.get.mock.calls[0];
    expect(path).toEqual(mockTextConfig.request.path);

    // Test Express Router Callback
    const mockReq = { ...mockTextConfig.request };
    callback(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalledWith(mockTextConfig.response.resource);
  });
});
