import LogCreator, { loggerColors } from '../../src/utils/logging';

jest.unmock('chalk')
const chalk = require('chalk');

describe('Spec: logging utils', () => {
  describe('LogCreator', () => {
    let logger;
    beforeEach(() => {
      logger = new LogCreator();
    });

    const testLoggerOutput = (logType, logPrefix) => {
      const message = `Test ${logPrefix} Message`;
      const scenario = 'happyPath';
      const path = '/test'
      logger.setScenario(scenario).setPath(path);

      const result = logger[logType](message);
      const expected = `[Parrot] ${chalk.underline(path)}`
      + ` ${chalk.dim(`(${scenario})`)}\n\t${loggerColors[logType](`${logPrefix}: ${message}`)}`;
      return { result, expected };
    }

    it('can set a path', () => {
      const path = '/test';
      logger.setPath(path);
      expect(logger.path).toEqual(path);
    });

    it('can set a scenario', () => {
      const scenario = 'bigError';
      logger.setScenario(scenario);
      expect(logger.scenario).toEqual(scenario);
    });

    it('can log an info message', () => {
      const { result, expected } = testLoggerOutput('info', 'Info');
      expect(result).toEqual(expected);
    });

    it('can log a warning message', () => {
      const { result, expected } = testLoggerOutput('warn', 'Warning');
      expect(result).toEqual(expected);
    });

    it('can log an error message', () => {
      const { result, expected } = testLoggerOutput('error', 'Error');
      expect(result).toEqual(expected);
    });
  });
});
