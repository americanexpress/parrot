const registerMiddleware = require('../src/index');

describe('index', () => {
  describe('registerMiddleware', () => {
    let mockApp;
    beforeEach(() => {
      mockApp = {
        locals: {},
        get: jest.fn(),
      };
    });
    it('errors if app not passed', () => {
      // No app
      expect(registerMiddleware).toThrowError(/Invalid express app instance/);
      // Invalid app
      expect(registerMiddleware.bind(this, {})).toThrowError(/Invalid express app instance/);
    });
    it('errors if name is not passed in middleware options', () => {
      expect(registerMiddleware.bind(this, mockApp, {})).toThrowError(
        /You must pass a middleware name/,
      );
    });
    it('creates a parrot locals instance', () => {
      const opts = { name: 'testMiddleware' };
      registerMiddleware(mockApp, opts);
      expect(mockApp.locals.parrot).toEqual(expect.any(Object));
    });
    it('appends middleware to the registry', () => {
      const opts = { name: 'testMiddleware' };
      mockApp.locals = { parrot: {} };
      registerMiddleware(mockApp, opts);
      expect(mockApp.locals.parrot.registry).toEqual([opts.name]);
    });
    it('creates a parrot registry express endpoint', () => {
      const opts = { name: 'testMiddleware' };
      registerMiddleware(mockApp, opts);
      const registryCb = mockApp.get.mock.calls[0][1];
      const res = {
        json: jest.fn(),
      };
      registryCb({}, res);
      expect(res.json).toHaveBeenCalledWith({
        middlewares: [opts.name],
      });
    });
  });
});
