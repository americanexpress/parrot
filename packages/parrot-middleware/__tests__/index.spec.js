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

    it('applies routes to an express app', () => {
      const app = {
        use: jest.fn(),
        get: jest.fn(),
        post: jest.fn()
      };
      createMiddlewareForScenario({ scenarios: scenarioFixture })(app);
      expect(app.use).toHaveBeenCalled();
      expect(app.get).toHaveBeenCalled();
      expect(app.post).toHaveBeenCalled();
    });
  });
});
