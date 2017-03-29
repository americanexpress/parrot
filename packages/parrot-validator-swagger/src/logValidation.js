import chalk from 'chalk';

const logValidation = (
  routeValidation,
  outputFn = (txt) => console.log(chalk.yellow(txt)),
) => {
  let errors = [];
  if (routeValidation.errors) {
    errors = Array.isArray(routeValidation.errors) ?
      routeValidation.errors : [routeValidation.errors];
  }
  outputFn(`The route validation found ${errors.length} error(s).`);
  errors.forEach(err => outputFn(err.message));
};

export default logValidation;
