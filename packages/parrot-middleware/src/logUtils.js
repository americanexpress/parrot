import chalk from 'chalk';

// Logging colors
export const loggerColors = {
  info: chalk.white,
  error: chalk.red,
  swagger: chalk.yellow
};

// Logging templates
const infoTemplate = message => loggerColors.info(`Info: ${message}`);
const errorTemplate = message => loggerColors.error(`Error: ${message}`);
const swaggerTemplate = message => loggerColors.swagger(`Swagger: ${message}`);

class LogCreator {
  constructor() {
    this.info = this.baseTemplate(infoTemplate);
    this.error = this.baseTemplate(errorTemplate);
    this.swagger = this.baseTemplate(swaggerTemplate);
  }
  baseTemplate(template) {
    return message => `[Parrot] ${chalk.underline(this.path)}`
    + ` ${chalk.dim(`(${this.scenario})`)}\n\t${template(message)}`;
  }
  setScenario(scenario) {
    this.scenario = scenario;
  }
  setPath(path) {
    this.path = path;
  }
 }

export default new LogCreator();
