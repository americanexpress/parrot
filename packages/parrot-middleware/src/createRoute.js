import resolveResponse from './resolveResponse';

export default function createRoute(router, config, validator, logger) {
  // Set Default Method to HTTP GET
  const method = config.request.method ? config.request.method.toLowerCase() : 'get';
  const statusCode = config.response.statusCode || 200;
  const urlParamPath = config.request.path;

  return router[method](urlParamPath, (req, res, next) => {
    let responseResource;
    try {
      const app = {req, res};
      responseResource = resolveResponse(config, app, logger);
    } catch (e) {
      console.log(e.message)
      next(); // something didn't match, move on to next route
      return;
    }

    if (validator) {
      const routeValidation = validator(responseResource, config);
      // Convert to array if passes back a single error
      let errors = [];
      if (routeValidation.errors) {
        errors = Array.isArray(routeValidation.errors) ?
          routeValidation.errors : [routeValidation.errors];
      }
      console.log(`The route validation found ${errors.length} error(s).`);
      errors.forEach(err => console.log(logger.warn(err.message)));
    }

    const responseMethod = typeof responseResource === 'object' ? 'json' : 'send';

    res.status(statusCode);
    if (config.response.delay) {
      setTimeout(() => {
        res[responseMethod](responseResource);
      }, config.response.delay);
    } else {
      res[responseMethod](responseResource);
    }
  });
}
