import createMiddleware from '../src';
import matchMock from '../src/matchMock';
import resolveResponse from '../src/resolveResponse';

global.console.error = jest.fn();
jest.mock('express');
jest.mock('parrot-registry');
jest.mock('../src/matchMock');
jest.mock('../src/resolveResponse');

const scenarios = {
  happy: [
    {
      request: {
        path: '/test',
        method: 'GET',
      },
      response: {
        resource: {
          success: true,
          message: 'You are a winner!',
        },
        statusCode: 200,
      },
    },
  ],
  sad: [
    {
      request: {
        path: '/test',
        method: 'GET',
      },
      response: {
        resource: {
          success: false,
          message: 'You failed.',
        },
        statusCode: 200,
      },
    },
  ],
};

describe('createMiddleware', () => {
  let app;
  beforeEach(() => {
    app = {
      use: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      all: jest.fn(),
    };
  });

  it('returns a curried function', () => {
    expect(createMiddleware({ scenarios })).toEqual(expect.any(Function));
  });

  it('applies routes to an express app', () => {
    createMiddleware({ scenarios })(app);
    expect(app.use).toHaveBeenCalled();
    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
    expect(app.all).toHaveBeenCalled();
  });

  it('resolves a mock', () => {
    matchMock.mockReturnValueOnce(true);
    resolveResponse.mockClear();
    createMiddleware({ scenarios })(app);

    const [[, mockCall]] = app.all.mock.calls;
    const next = jest.fn();
    mockCall(null, null, next);
    expect(next).not.toHaveBeenCalled();
    expect(resolveResponse).toHaveBeenCalled();
  });

  it('resolves a mock function', () => {
    matchMock.mockReturnValueOnce(false);
    resolveResponse.mockClear();
    createMiddleware({ scenarios })(app);

    const [[, mockCall]] = app.all.mock.calls;
    const next = jest.fn();
    mockCall(null, { headersSent: true }, next);
    expect(next).not.toHaveBeenCalled();
    expect(resolveResponse).not.toHaveBeenCalled();
  });

  it('does not resolve a mock function', () => {
    matchMock.mockReturnValueOnce(false);
    resolveResponse.mockClear();
    createMiddleware({ scenarios })(app);

    const [[, mockCall]] = app.all.mock.calls;
    const next = jest.fn();
    mockCall(null, { headersSent: false }, next);
    expect(next).toHaveBeenCalled();
    expect(resolveResponse).not.toHaveBeenCalled();
  });

  it('gets the active scenario', () => {
    createMiddleware({ scenarios })(app);
    const [[, getScenario]] = app.get.mock.calls;
    const [defaultScenario] = Object.keys(scenarios);
    const mockRes = {
      json: jest.fn(),
    };
    getScenario(null, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(defaultScenario);
  });

  it('changes the active scenario', () => {
    createMiddleware({ scenarios })(app);
    const [[, getScenario]] = app.get.mock.calls;
    const [[, setScenario]] = app.post.mock.calls;
    const [, newScenario] = Object.keys(scenarios);
    const mockReq = {
      body: {
        scenario: newScenario,
      },
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

  it('gets all scenarios', () => {
    createMiddleware({ scenarios })(app);
    const [, [, getScenarios]] = app.get.mock.calls;
    const mockRes = {
      json: jest.fn(),
    };
    getScenarios(null, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(scenarios);
  });
});
