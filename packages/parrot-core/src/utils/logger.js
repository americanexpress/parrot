import chalk from 'chalk';

// Logging colors
export const loggerColors = {
  info: chalk.white,
  warn: chalk.yellow,
  error: chalk.red,
};

// Logging templates
const infoTemplate = message => loggerColors.info(`Info: ${message}`);
const errorTemplate = message => loggerColors.error(`Error: ${message}`);
const warnTemplate = message => loggerColors.warn(`Warning: ${message}`);

class Logger {
  constructor(output = console.log) {
    this.output = output;
    this.info = this.baseTemplate(infoTemplate);
    this.error = this.baseTemplate(errorTemplate);
    this.warn = this.baseTemplate(warnTemplate);
  }

  baseTemplate(template) {
    return (message, path) =>
      this.output(
        `[Parrot] ${chalk.underline(path)}` +
          ` ${chalk.dim(`(${this.scenario})`)}\n\t${template(message)}`
      );
  }

  setScenario(scenario) {
    this.scenario = scenario;
    return this;
  }
}

export default new Logger();
