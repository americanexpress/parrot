import validateRouteConfig from '../src/validateRouteConfig';

describe('Spec: validateRouteConfig', () => {
  it('throws error if missing request or response property', () => {
    const mockConfig = {
      response: 'mocks/something.json',
    };
    const boundValidate = validateRouteConfig.bind(null, mockConfig);
    expect(boundValidate).toThrowError(/config must be an object with keys/);
  });
});
