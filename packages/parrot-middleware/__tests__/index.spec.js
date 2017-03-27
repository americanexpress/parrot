import { Router } from 'express'
import createMiddlewareForScenario from '../src/index';

// Uncomment for debugging
// const log = console.log;
global.console = {error: jest.fn()}
jest.mock('express');

const routerInstance = jest.fn();
Router.mockImplementation(() => routerInstance);

const scenarioFixture = {
  happy: [
    {
      request: '/test',
      response: {
        resource: {
          success: true,
          message: 'You are a winner!'
        }
      }
    }
  ],
  sad: [
    {
      request: '/test',
      response: {
        resource: {
          success: false,
          message: 'You failed.'
        }
      }
    }
  ]
};

describe('Spec: Index', () => {
  describe('createMiddlewareForScenario', () => {
    let app;
    beforeEach(() => {
      app = {
        use: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
      };
      routerInstance.mockClear();
    });
    it('returns a curried function', () => {
      expect(createMiddlewareForScenario({})).toEqual(expect.any(Function));
    });

    it('logs an error if unable to create a scenario route', () => {
      const invalidConfig = {
        bad: [
          {
            response: {}
          }
        ]
      };
      createMiddlewareForScenario({ scenarios: invalidConfig })(app);
      expect(console.error).toHaveBeenCalled()
      expect(console.error.mock.calls[0][0]).toMatch(/^Your route config must be/);
    });

    it('applies routes to an express app', () => {
      createMiddlewareForScenario({ scenarios: scenarioFixture })(app);
      expect(app.use).toHaveBeenCalled();
      expect(app.get).toHaveBeenCalled();
      expect(app.post).toHaveBeenCalled();
    });

    it('applies internally created routes to an express router', () => {
      createMiddlewareForScenario({ scenarios: scenarioFixture })(app);
      const routerCallback = (app.use.mock.calls[1][0]);
      const params = ['req', 'res', 'next'];
      routerCallback(...params);
      expect(routerInstance.mock.calls[0]).toEqual(params);
    });

    it('can get the default active scenario', () => {
      createMiddlewareForScenario({ scenarios: scenarioFixture })(app);
      const getScenario = (app.get.mock.calls[0][1]);
      const defaultScenario = Object.keys(scenarioFixture)[0];
      const mockRes = {
        json: jest.fn(),
      };
      getScenario(null, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(defaultScenario);
    });

    it('can change the active scenario', () => {
      createMiddlewareForScenario({ scenarios: scenarioFixture })(app);
      const getScenario = (app.get.mock.calls[0][1]);
      const setScenario = (app.post.mock.calls[0][1]);
      const newScenario = Object.keys(scenarioFixture)[1];
      const mockReq = {
        body: {
          scenario: newScenario
        }
      };
      const mockRes = {
        json: jest.fn(),
        sendStatus: jest.fn(),
      };
      setScenario(mockReq, mockRes);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
      getScenario(null, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(newScenario);
    });

    it('can output the scenarios config', () => {
      createMiddlewareForScenario({ scenarios: scenarioFixture })(app);
      const getScenarios = (app.get.mock.calls[1][1]);
      const mockRes = {
        json: jest.fn(),
      };
      getScenarios(null, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(scenarioFixture);

    });
  });
});
