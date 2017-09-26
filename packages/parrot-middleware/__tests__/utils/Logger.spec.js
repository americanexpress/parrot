global.console.log = jest.fn();
const { default: logger, loggerColors } = require('../../src/utils/Logger');

jest.unmock('chalk');
const chalk = require('chalk');

describe('Logger', () => {
  const testLoggerOutput = (logType, logPrefix) => {
    const message = `Test ${logPrefix} Message`;
    const scenario = 'happyPath';
    const path = '/test';
    logger.setScenario(scenario);

    logger[logType](message, path);
    return (
      `[Parrot] ${chalk.underline(path)}` +
      ` ${chalk.dim(`(${scenario})`)}\n\t${loggerColors[logType](`${logPrefix}: ${message}`)}`
    );
  };

  it('can set a scenario', () => {
    const scenario = 'bigError';
    logger.setScenario(scenario);
    expect(logger.scenario).toEqual(scenario);
  });

  it('can log an info message', () => {
    const expected = testLoggerOutput('info', 'Info');
    expect(global.console.log).toHaveBeenCalledWith(expected);
  });

  it('can log a warning message', () => {
    const expected = testLoggerOutput('warn', 'Warning');
    expect(global.console.log).toHaveBeenCalledWith(expected);
  });

  it('can log an error message', () => {
    const expected = testLoggerOutput('error', 'Error');
    expect(global.console.log).toHaveBeenCalledWith(expected);
  });
});
