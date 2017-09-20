import chalk from 'chalk';
import validateAgainstSwagger from './validateAgainstSwagger';
import logValidation from './logValidation';

const validatorMiddleware = ({
  swaggerModel,
  matcher = () => true,
  outputFn = txt => console.log(chalk.yellow(txt)), // eslint-disable-line no-console
}) => (req, res, next) => {
  if (matcher(req)) {
    // Grab response body by monkeypatching res.write
    const chunks = [];
    const originalWrite = res.write;

    res.write = chunk => {
      // eslint-disable-line
      chunks.push(chunk);
      originalWrite.apply(res, arguments); // eslint-disable-line prefer-rest-params
    };

    res.on('finish', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      // Allows handling for swagger schema as either promise or object
      return Promise.resolve(swaggerModel)
        .then(resolvedModel => {
          const parsedBody = JSON.parse(body);
          const urlParamPath = req.path;
          const method = req.method ? req.method.toLowerCase() : 'get';
          const statusCode = res.statusCode || 200;
          const routeValidation = validateAgainstSwagger(
            parsedBody,
            resolvedModel,
            urlParamPath,
            method,
            statusCode
          );
          logValidation(routeValidation, outputFn);
        })
        .catch(err => {
          outputFn('Validator failed due to internal error: ', err);
        });
    });
  }
  next();
};

export default validatorMiddleware;
