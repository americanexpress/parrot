import loadSwagger from './loadSwagger';
import validateAgainstSwagger from './validateSwagger';

export default function(resolvedResponse, config) {
  const urlParamPath = config.request.path;
  const method = config.request.method.toLowerCase();
  const statusCode = config.response.statusCode || 200;
  loadSwagger().then(swaggerModel => {
    try {
      return validateAgainstSwagger(resolvedResponse, swaggerModel, urlParamPath, method, statusCode);
    } catch (err) {
      return {
        valid: false,
        errors: err
      };
    }
  });
}
