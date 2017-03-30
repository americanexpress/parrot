const chalk = jest.genMockFromModule('chalk');

chalk.yellow = jest.fn((txt) => txt);
module.exports = chalk;
