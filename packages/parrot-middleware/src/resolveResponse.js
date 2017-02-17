import cloneDeep from 'lodash/cloneDeep';
import util from 'util';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

/**
*  Uses request config to set up router path
*/
export default function resolveResponse(config, request, logger) {
  const configCopy = cloneDeep(config); // do not modify original config
  // Handle cases where request params are used
  // {
  //  request: '/account-data/offers/v1/offers/:id',
  //  response: ({ id }) => require(`test/mocks/details/${id}`)
  // }
  if (!isEmpty(request.params) &&
    typeof configCopy.response.resource === 'function') {
    configCopy.response.resource = configCopy.response.resource(request.params);
  }

  // Match request headers
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

  return configCopy.response.resource;
}
