import path from 'path';
import parrotListener from '../src/parrotListener';
import writeFile from '../src/writeFile';
import writeScenarioFile from '../src/writeScenarioFile';

jest.mock('path');
jest.mock('promisify-node');
jest.mock('parrot-registry');
jest.mock('../src/writeScenarioFile');
jest.mock('../src/writeFile');

path.join.mockImplementation(() => '/something');
writeScenarioFile.mockImplementation(() => Promise.resolve({}));
writeFile.mockImplementation(() => Promise.resolve({}));

describe('parrotListener', () => {
  let listener;

  it('returns an express middleware on initialization', () => {
    listener = parrotListener({});
    expect(listener).toEqual(expect.any(Function));
  });

  describe('constructor', () => {
    let app;
    beforeEach(() => {
      app = {
        use: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
      };
      writeScenarioFile.mockImplementation(() => Promise.resolve({}));
    });

    it('can start the listener', () => {
      listener = parrotListener({ isListening: false });
      listener(app);
      expect(app.get).toHaveBeenCalled();
      expect(app.put).toHaveBeenCalled();
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
      };
      const getListening = app.get.mock.calls[0][1];
      const setListening = app.put.mock.calls[0][1];
      getListening({}, res);
      expect(res.json).toHaveBeenCalledWith({ isListening: false });
      res.json.mockClear();
      const body = {
        scenarioName: 'testListen',
        action: 'START',
      };
      setListening({ body }, res);
      getListening({}, res);
      expect(res.json).toHaveBeenCalledWith({ isListening: true, scenarioName: body.scenarioName });
    });

    it('errors if trying to start listener when already listening', () => {
      const config = {
        listening: true,
        name: 'test',
      };
      listener = parrotListener(config);
      listener(app);
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
      };
      const setListening = app.put.mock.calls[0][1];
      const body = {
        scenarioName: 'testListen',
        action: 'START',
      };
      setListening({ body }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ reason: 'Already listening!' });
    });

    it('errors if trying to start listener without a name defined', () => {
      const config = {
        isListening: false,
      };
      listener = parrotListener(config);
      listener(app);
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
      };
      const setListening = app.put.mock.calls[0][1];
      const body = {
        action: 'START',
      };
      setListening({ body }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ reason: 'Missing request field: "scenarioName"' });
    });

    it('errors if attempting to change listening status other than start or stop', () => {
      const config = {
        isListening: false,
      };
      listener = parrotListener(config);
      listener(app);
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
      };
      const setListening = app.put.mock.calls[0][1];
      const body = {
        action: 'OTHER',
      };
      setListening({ body }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ reason: expect.any(String) });
    });

    it('can stop the listener', () => {
      const config = { listening: true, name: 'testing' };
      listener = parrotListener(config);
      listener(app);
      expect(app.get).toHaveBeenCalled();
      expect(app.put).toHaveBeenCalled();
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
      };
      const getListening = app.get.mock.calls[0][1];
      const setListening = app.put.mock.calls[0][1];
      getListening({}, res);
      expect(res.json).toHaveBeenCalledWith({
        isListening: config.listening,
        scenarioName: config.name,
      });
      res.json.mockClear();
      const body = {
        scenarioName: 'testing',
        action: 'STOP',
      };
      setListening({ body }, res);
      getListening({}, res);
      expect(res.json).toHaveBeenCalledWith({ isListening: false });
    });

    it('errors if unable to write scenario file when listening stopped', async () => {
      writeScenarioFile.mockImplementation(() => Promise.reject('Fail'));
      const config = {
        listening: true,
        logger: jest.fn(),
      };
      listener = parrotListener(config);
      listener(app);
      const setListening = app.put.mock.calls[0][1];
      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };
      const body = { action: 'STOP' };
      await setListening({ body }, res);
      expect(config.logger).toHaveBeenCalledWith('Fail');
    });

    describe('middleware', () => {
      const setupMiddleware = (
        config = { listening: true, name: 'testing', logger: jest.fn() }
      ) => {
        listener = parrotListener(config);
        listener(app);
        return app.use.mock.calls[1][0];
      };

      let req;
      let res;
      let next;
      beforeEach(() => {
        jest.clearAllMocks();
        req = {};
        res = {
          json: jest.fn(),
          on: jest.fn(),
          status: jest.fn(() => res),
          send: jest.fn(),
          locals: {},
        };
        next = jest.fn();
      });

      it('applies a middleware function to express', () => {
        const middleware = setupMiddleware();
        expect(middleware).toEqual(expect.any(Function));
      });

      it('skips middleware if request does not meet matcher function validation', () => {
        const middleware = setupMiddleware({ matcher: () => false });
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.on).not.toHaveBeenCalled();
      });

      it('applies an id to the response locals', () => {
        const middleware = setupMiddleware();
        middleware(req, res, next);
        expect(res.locals.parrot.id).toEqual(expect.any(String));
      });

      it('monkeypatches the write function - it still works as expected', () => {
        const mockWrite = jest.fn();
        const testChunk = 'test chunk';
        res.write = mockWrite;
        const middleware = setupMiddleware();
        middleware(req, res, next);
        res.write(testChunk);
        expect(mockWrite).toHaveBeenCalledWith(testChunk);
      });

      it('writes a json file on response finish', () => {
        // Setup - create middleware and override write
        const mockWrite = jest.fn();
        res.write = mockWrite;
        const middleware = setupMiddleware();
        middleware(req, res, next);
        res.statusCode = 200;

        // Write chunks
        const testChunks = ['test chunk', 'other chunk'];
        res.write(Buffer.from(testChunks[0]));
        res.write(Buffer.from(testChunks[1]));
        // Call finish
        const finish = res.on.mock.calls[0][1];
        finish();
        expect(writeFile).toHaveBeenCalledWith(expect.any(String), testChunks.join(''));
      });

      it('does not write file if response status code is outside 200 range', () => {
        // Setup - create middleware and override write
        const middleware = setupMiddleware();
        middleware(req, res, next);
        res.statusCode = 404;

        // Call finish
        const finish = res.on.mock.calls[0][1];
        const noop = finish();
        expect(writeFile).not.toHaveBeenCalled();
        expect(noop()).toBe(null);
      });

      it('errors if unable to write json file on response finish', async () => {
        const err = 'Unable to write file';
        writeFile.mockImplementation(() => Promise.reject(err));
        const config = {
          isListening: true,
          scenarioName: 'test',
          logger: jest.fn(),
        };
        const middleware = setupMiddleware(config);
        middleware(req, res, next);
        res.statusCode = 200;
        const finish = res.on.mock.calls[0][1];
        await finish();
        expect(writeFile).toHaveBeenCalled();
        const errMsg = `ERROR: Unable to write parrot-listener scenario file: ${err}\n`;
        expect(config.logger).toHaveBeenCalledWith(errMsg);
      });

      it('stops listener on process exit', () => {
        const realProcessOn = process.on;
        process.on = jest.fn((...args) => realProcessOn.apply(process, args));
        const middleware = setupMiddleware();
        middleware(req, res, next);
        const getListening = app.get.mock.calls[0][1];

        // Initially parrot is listening
        getListening({}, res);
        expect(res.json).toHaveBeenCalledWith({ isListening: true, scenarioName: 'testing' });
        res.json.mockClear();
        // Run the on-exit calback
        expect(process.on.mock.calls[0][0]).toEqual('exit');
        const killListener = process.on.mock.calls[0][1];
        killListener();
        // Check now
        getListening({}, res);
        expect(res.json).toHaveBeenCalledWith({ isListening: false });
        // Reset mock
        process.on = realProcessOn;
      });

      it('does not stop listener if not running', () => {
        const realProcessOn = process.on;
        process.on = jest.fn((...args) => realProcessOn.apply(process, args));
        const middleware = setupMiddleware({ isListening: false });
        middleware(req, res, next);
        const getListening = app.get.mock.calls[0][1];

        // Initially parrot is listening
        getListening({}, res);
        expect(res.json).toHaveBeenCalledWith({ isListening: false });
        res.json.mockClear();
        // Run the on-exit calback
        expect(process.on.mock.calls[0][0]).toEqual('exit');
        const killListener = process.on.mock.calls[0][1];
        killListener();
        // Check now
        getListening({}, res);
        expect(res.json).toHaveBeenCalledWith({ isListening: false });
        // Reset mock
        process.on = realProcessOn;
      });

      it('logs errors', () => {
        const logger = jest.fn();
        writeFile.mockImplementation(() => {
          throw Error('Parrot failed.');
        });
        const middleware = setupMiddleware({ logger });
        res.statusCode = 200;
        middleware(req, res, next);
        const finish = res.on.mock.calls[0][1];
        finish();
        expect(logger.mock.calls[0][0]).toMatch(/ERROR: Error in parrot-listener/);
      });
    });
  });
});
