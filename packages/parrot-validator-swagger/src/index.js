import loadSwagger from './loadSwagger';
import validateAgainstSwagger from './validateSwagger';

export default function SwaggerValidator(validatorConfig) {
  const { swaggerUrl, swaggerCachePath } = validatorConfig;

  return function validator(resolvedResponse, routeConfig) {
    const urlParamPath = routeConfig.request.path;
    const method = routeConfig.request.method ?
      routeConfig.request.method.toLowerCase() : 'get';
    const statusCode = routeConfig.response.statusCode || 200;
    return loadSwagger(swaggerUrl, swaggerCachePath).then((swaggerModel) => {
      try {
        return validateAgainstSwagger(
          resolvedResponse, swaggerModel, urlParamPath, method, statusCode,
        );
      } catch (err) {
        return {
          valid: false,
          errors: err,
        };
      }
    });
  };
}
