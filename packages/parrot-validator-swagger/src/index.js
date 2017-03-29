import loadSwagger from './loadSwagger';
import validateAgainstSwagger from './validateSwagger';
import logValidation from './logValidation';

const swaggerValidator = ({
  swaggerModel,
  matcher = () => true,
  outputFn,
}) => (req, res, next) => {
  if (matcher(req)) {
    // Grab response body by monkeypatching res.write
    const chunks = [];
    const _originalWrite = res.write;

    res.write = function (chunk) {
      chunks.push(chunk);
      _originalWrite.apply(res, arguments);
    };

    res.on('finish', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      try {
        // Allows handling for swagger schema as either promise or object
        Promise.resolve(swaggerModel).then((resolvedModel) => {
          const parsedBody = JSON.parse(body);
          const urlParamPath = req.path;
          const method = req.method ?  req.method.toLowerCase() : 'get';
          const statusCode = res.statusCode || 200;
          const routeValidation = validateAgainstSwagger(
            parsedBody, resolvedModel, urlParamPath, method, statusCode,
          );
          logValidation(routeValidation, outputFn);
        });

      } catch (err) {
        console.log('Validator failed due to internal error: ', err);
      }
    });
    next();
  }
};

export default swaggerValidator;
