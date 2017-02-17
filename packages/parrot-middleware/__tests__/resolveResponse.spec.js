import resolveResponse from '../src/resolveResponse';
import LogCreator from '../src/utils/logging';

describe('Spec: resolveResponse', () => {
  let logger;
  beforeEach(() => {
    logger = new LogCreator();
  });

  it('can match a config to a request', () => {
    const mockRequest = {
      path: '/account-data/v1/test',
      method: 'get'
    };
    const mockConfig = {
      request: { ...mockRequest },
      response: {
        resource: { success: true }
      }
    };
    const response = resolveResponse(mockConfig, mockRequest, logger);
    expect(response).toEqual(mockConfig.response.resource);
  });

  it('provides a callback if request parameters used in route', () => {
    const mockConfig = {
      request: {
        path: '/account-data/v1/test/:id'
      },
      response: {
        resource: ({ id }) => ({ testId: `PMC-${id}`})
      }
    };
    const mockRequest = {
      path: '/account-data/v1/test/:id',
      params: {
        id: 25
      }
    };
    const response = resolveResponse(mockConfig, mockRequest, logger);
    expect(response).toEqual({
      testId: 'PMC-25'
    })
  });

  it('throws an error if config does not match', () => {
    const mockRequest = {
      path: '/account-data/v1/test',
      method: 'get'
    };
    const mockConfig = {
      request: {
        path: '/account-data/v1/test',
        method: 'put'
      }
    };
    const errorResolve = resolveResponse.bind(null, mockConfig, mockRequest, logger);
    expect(errorResolve).toThrowError(/Not able to match request property method/);
  });

  it('matches headers only if all headers match', () => {
    const mockRequest = {
      path: '/account-data/v1/test',
      headers: {
        test: 'valid',
        other: 'valid'
      },
      method: 'get'
    };
    const mockConfig = {
      request: {
        ...mockRequest,
        headers: {
          test: 'valid',
          other: 'invalid'
        }
      }
    };
    const errorResolve = resolveResponse.bind(null, mockConfig, mockRequest, logger);
    expect(errorResolve).toThrowError(/Not able to match header other/);
  });
});
