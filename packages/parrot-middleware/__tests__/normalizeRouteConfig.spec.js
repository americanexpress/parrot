import normalizeRouteConfig from '../src/normalizeRouteConfig';

describe('Spec: normalizeRouteConfig', () => {
  it('converts request string shorthand', () => {
    const mockConfig = {
      request: 'api/endpoint/offers',
      response: 'mocks/something.json'
    };
    const { request } = normalizeRouteConfig(mockConfig);
    expect(request.path).toEqual(mockConfig.request);
  });

  it('converts response string shorthand', () => {
    const mockConfig = {
      request: 'api/endpoint/offers',
      response: 'mocks/something.json'
    };
    const { response } = normalizeRouteConfig(mockConfig);
    expect(response.resource).toEqual(mockConfig.response);
  });

  it('does nothing if request and response are objects', () => {
    const mockConfig = {
      request: {
        path: 'api/endpoint/offers'
      },
      response: {
        resource: 'mocks/something.json'
      }
    };
    const { request, response } = normalizeRouteConfig(mockConfig);
    expect(request).toEqual(mockConfig.request);
    expect(response).toEqual(mockConfig.response);
  });
});
