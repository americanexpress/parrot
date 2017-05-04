import resolveResponse from '../src/resolveResponse';
import LogCreator from '../src/utils/logging';

jest.unmock('chalk');

describe('Spec: resolveResponse', () => {
  let logger;
  beforeEach(() => {
    logger = new LogCreator();
  });

  it('can match a config to a request', () => {
    const mockRequest = {
      path: '/api/v1/test',
      method: 'get',
      params: {},
    };
    const mockConfig = {
      request: { ...mockRequest },
      response: {
        resource: { success: true },
      },
    };
    const response = resolveResponse(mockConfig, { req: mockRequest }, logger);
    expect(response).toEqual(mockConfig.response.resource);
  });

  it('provides a callback if resource is a function with one parameter', () => {
    const mockConfig = {
      request: {
        path: '/api/v1/test/:id',
      },
      response: {
        resource: ({ params: { id } }) => ({ testId: `PMC-${id}` }),
      },
    };
    const mockRequest = {
      path: '/api/v1/test/25',
      params: {
        id: 25,
      },
    };
    const response = resolveResponse(mockConfig, { req: mockRequest }, logger);
    expect(response).toEqual({
      testId: 'PMC-25',
    });
  });

  it('provides express req and res if resource is a function with two parameters', () => {
    const statusCode = 400;
    const mockConfig = {
      request: {
        path: '/api/v1/test/:id',
      },
      response: {
        resource: (req, res) => {
          res.status(statusCode).jsonp({
            accountId: req.headers.accountId,
            pmcId: `PMC-${req.params.pmcId}`,
            error: true,
          });
        },
      },
    };
    const mockReq = {
      path: '/api/v1/test/25',
      headers: {
        accountId: 1029,
      },
      params: {
        id: 25,
      },
    };
    const mockRes = {
      jsonp: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    resolveResponse(mockConfig, { req: mockReq, res: mockRes }, logger);
    expect(mockRes.status).toHaveBeenCalledWith(statusCode);
    expect(mockRes.jsonp).toHaveBeenCalled();
  });

  it('throws an error if config does not match', () => {
    const mockRequest = {
      path: '/api/v1/test',
      params: {},
      method: 'get',
    };
    const mockConfig = {
      request: {
        path: '/api/v1/test',
        method: 'put',
      },
    };
    const errorResolve = resolveResponse.bind(null, mockConfig, { req: mockRequest }, logger);
    expect(errorResolve).toThrowError(/Not able to match request property method/);
  });

  it('matches headers only if all headers match', () => {
    const mockRequest = {
      path: '/api/v1/test',
      params: {},
      headers: {
        test: 'valid',
        other: 'valid',
      },
      method: 'get',
    };
    const mockConfig = {
      request: {
        ...mockRequest,
        headers: {
          test: 'valid',
          other: 'invalid',
        },
      },
    };
    const errorResolve = resolveResponse.bind(null, mockConfig, { req: mockRequest }, logger);
    expect(errorResolve).toThrowError(/Not able to match header other/);
  });
});
