/**
* Checks structure of route config
* TODO stricter validation
*/
export default function validateRouteConfig(config) {
  const keys = Object.keys(config);
  if (keys.indexOf('request') === -1 || keys.indexOf('response') === -1) {
    throw Error('Your route config must be an object with keys `request` and `response`.');
  }
  /*
  if (typeof config.request !== 'object' || Array.isArray(config.request)) {
    throw Error('Your request config must be an object.');
  }
  if (typeof config.request.path !== 'string') {
    throw Error('Your request config must contain a property "path" as a string.');
  }
  */
}
