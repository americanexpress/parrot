import normalizeRouteConfig from '../src/normalizeRouteConfig';

describe('normalizeRouteConfig', () => {
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
});
