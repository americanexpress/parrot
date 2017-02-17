import resolveResponse from './resolveResponse';

export default function createRoute(router, config, logger) {
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
      logger.info(e.message);
      next(); // something didn't match, move on to next route
      return;
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
