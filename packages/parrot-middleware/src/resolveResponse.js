import cloneDeep from 'lodash/cloneDeep';
import util from 'util';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

/**
*  Uses request config to set up router path
*/
export default function resolveResponse(config, app, logger) {
  const configCopy = cloneDeep(config); // do not modify original config
  // Read in express req/res for resource callback functions
  const { req, res } = app;

  // Match request config properties
  Object.keys(configCopy.request).forEach((property) => {
    if (property === 'headers') {
      // Match all request headers if included in request config
      Object.keys(configCopy.request.headers).forEach((header) => {
        if (req.headers[header] !== configCopy.request.headers[header]) {
          throw Error(logger.info(`Not able to match header ${header}. Try next route.`));
        }
      });
    } else if (!isEqual(req[property], configCopy.request[property])) {
      throw Error(logger.info(`Not able to match request property ${property}.`
        + ` Trying next route. \n\trequest: ${util.inspect(req[property])}`
        + `\n\tconfig: ${util.inspect(configCopy.request[property])}`));
    }
  });

  // Update logging to use the matched config path
  logger.setPath(config.request.path);

  // Expose Express req/res if response config provides resource as a callback fn
  // {
  //  request: '/account-data/offers/v1/offers/:id',
  //  response: ({ params: { id } }) => require(`test/mocks/details/${id}`)
  //  OR
  //  response: (res, res) => { res.sendFile(require(`test/mocks/details/${id}`)) }
  // }
  const resource = configCopy.response.resource;
  if (typeof resource === 'function') {
    if (resource.length === 2) {
      resource(req, res);
    } else {
      configCopy.response.resource = resource(req);
    }
  }

  return configCopy.response.resource;
}
