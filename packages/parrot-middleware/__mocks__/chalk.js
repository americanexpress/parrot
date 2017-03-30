const chalk = jest.genMockFromModule('chalk');

chalk.white = jest.fn(txt => txt);
chalk.dim = jest.fn(txt => txt);
chalk.underline = jest.fn(txt => txt);

module.exports = chalk;
