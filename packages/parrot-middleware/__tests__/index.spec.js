import createMiddlewareForScenario from '../src/index';

const scenarioFixture = {
  test: [
    {
      request: '/account-data/v1/member',
      response: {
        resource: {
          success: true,
          message: 'You are a winner!'
        }
      }
    }
  ]
};

describe('Spec: Index', () => {
  describe('createMiddlewareForScenario', () => {
    it('returns a curried function', () => {
      expect(createMiddlewareForScenario({})).toEqual(expect.any(Function));
    });
  });
});
