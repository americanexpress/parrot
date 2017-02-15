import cloneDeep from 'lodash/cloneDeep';
import util from 'util';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

/**
*  Uses request config to set up router path
*/
export default function resolveResponse(config, request, logger) {
  const configCopy = cloneDeep(config); // do not modify original config
  /* eslint-disable guard-for-in */
  if (!isEmpty(request.params)) {
    let resource = configCopy.response.resource;
    let path = configCopy.request.path;
    Object.keys(request.params).forEach((param) => {
      if (typeof resource === 'string') {
        resource = resource.replace(`:${param}`, request.params[param]);
      }
      path = path.replace(`:${param}`, request.params[param]);
    });
    configCopy.response.resource = resource;
    configCopy.request.path = path;
  }

  Object.keys(configCopy.request).forEach((property) => {
    if (property === 'headers') {
      Object.keys(configCopy.request.headers).forEach((header) => {
        if (request.headers[header] !== configCopy.request.headers[header]) {
          throw Error(logger.info(`Not able to match header ${header}. Try next route.`));
        }
      });
    } else if (!isEqual(request[property], configCopy.request[property])) {
      throw Error(logger.info(`Not able to match request property ${property}.`
        + ` Trying next route. \n\trequest: ${util.inspect(request[property])}`
        + `\n\tconfig: ${util.inspect(configCopy.request[property])}`));
    }
  });

  // Update logging to use the matched config path
  logger.setPath(config.request.path);

  return config.response.resource;
  /* eslint-enable guard-for-in */
}
