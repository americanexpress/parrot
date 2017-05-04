import cloneDeep from 'lodash/cloneDeep';

/**
* Converts scenario shorthand into full configs
* request: <urlstring> -> request: { path: <urlstring> }
* response: <HTTP compatible response> -> response: { resource: <HTTP compatible response> }
*/
export default function normalizeRouteConfig(config) {
  const configCopy = cloneDeep(config); // do not modify original config
  if (typeof configCopy.request === 'string') {
    configCopy.request = {
      path: configCopy.request,
      method: 'GET',
    };
  }
  if (typeof config.response !== 'object' || typeof config.response.resource === 'undefined') {
    configCopy.response = {
      resource: configCopy.response,
      statusCode: 200,
    };
  }
  return configCopy;
}
