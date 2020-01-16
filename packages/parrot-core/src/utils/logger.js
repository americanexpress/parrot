/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/* eslint no-console: 'off' */
import chalk from 'chalk';

export const loggerColors = {
  info: chalk.white,
  warn: chalk.yellow,
  error: chalk.red,
};

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
