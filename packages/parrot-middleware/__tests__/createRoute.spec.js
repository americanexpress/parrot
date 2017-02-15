import LoggerCreator from '../src/utils/logging';
import createRoute from '../src/createRoute';

describe('createRoute', () => {
  let logger;
  beforeEach(() => {
    logger = new LoggerCreator();
  });

  it('adds a path to the router', () => {
    const mockConfig = {
      request: {
        path: '/test',
        method: 'GET'
      },
      response: {
        resource: { success: true }
      }
    };
    const router = {
      get: jest.fn()
    };
    createRoute(router, mockConfig, logger);
    expect(router.get).toHaveBeenCalled();
    const [path, callback] = router.get.mock.calls[0];
    expect(path).toEqual(mockConfig.request.path);

    // Test Express Router Callback
    const mockReq = { ...mockConfig.request };
    const mockRes = {
      status: jest.fn(),
      json: jest.fn()
    };
    const mockNext = jest.fn();
    callback(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(mockConfig.response.resource);
  });

  it('calls next if resolveResponse throws an error', () => {
    const mockConfig = {
      request: {
        path: '/test',
        method: 'GET'
      },
      response: {
        resource: { success: true }
      }
    };
    const router = {
      get: jest.fn()
    };
    createRoute(router, mockConfig, logger);
    expect(router.get).toHaveBeenCalled();
    const [path, callback] = router.get.mock.calls[0];
    expect(path).toEqual(mockConfig.request.path);

    // Test Express Router Callback
    const mockReq = {
      path: '/other'
    };
    const mockRes = {
      status: jest.fn(),
      json: jest.fn()
    };
    const mockNext = jest.fn();
    callback(mockReq, mockRes, mockNext);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
