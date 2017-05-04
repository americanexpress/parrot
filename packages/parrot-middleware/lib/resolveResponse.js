'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveResponse;

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
*  Uses request config to set up router path
*/
function resolveResponse(config, app, logger) {
  var configCopy = (0, _cloneDeep2.default)(config); // do not modify original config
  // Read in express req/res for resource callback functions
  var req = app.req,
      res = app.res;

  // Match request config properties

  Object.keys(configCopy.request).forEach(function (property) {
    if (property === 'headers') {
      // Match all request headers if included in request config
      Object.keys(configCopy.request.headers).forEach(function (header) {
        if (req.headers[header] !== configCopy.request.headers[header]) {
          throw Error(logger.info('Not able to match header ' + header + '. Try next route.'));
        }
      });
      // Special case to check against paths using request params
    } else if (property === 'path') {
      (function () {
        var parsedPath = config.request.path;
        Object.keys(req.params).forEach(function (param) {
          parsedPath = parsedPath.replace(':' + param, req.params[param]);
        });
        if (!(0, _isEqual2.default)(parsedPath, req.path)) {
          throw Error(logger.info('Not able to match parsed request property ' + property + '.' + (' Trying next route. \n\trequest: ' + _util2.default.inspect(req[property])) + ('\n\tconfig: ' + _util2.default.inspect(configCopy.request[property]))));
        }
      })();
    } else if (!(0, _isEqual2.default)(req[property], configCopy.request[property])) {
      throw Error(logger.info('Not able to match request property ' + property + '.' + (' Trying next route. \n\trequest: ' + _util2.default.inspect(req[property])) + ('\n\tconfig: ' + _util2.default.inspect(configCopy.request[property]))));
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
  var resource = configCopy.response.resource;
  if (typeof resource === 'function') {
    if (resource.length === 2) {
      resource(req, res);
    } else {
      configCopy.response.resource = resource(req);
    }
  }

  return configCopy.response.resource;
}