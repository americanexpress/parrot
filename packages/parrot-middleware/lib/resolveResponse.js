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

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
*  Uses request config to set up router path
*/
function resolveResponse(config, request, logger) {
  var configCopy = (0, _cloneDeep2.default)(config); // do not modify original config
  // Handle cases where request params are used
  // {
  //  request: '/account-data/offers/v1/offers/:id',
  //  response: ({ id }) => require(`test/mocks/details/${id}`)
  // }
  if (!(0, _isEmpty2.default)(request.params) && typeof configCopy.response.resource === 'function') {
    configCopy.response.resource = configCopy.response.resource(request.params);
  }

  // Match request headers
  Object.keys(configCopy.request).forEach(function (property) {
    if (property === 'headers') {
      Object.keys(configCopy.request.headers).forEach(function (header) {
        if (request.headers[header] !== configCopy.request.headers[header]) {
          throw Error(logger.info('Not able to match header ' + header + '. Try next route.'));
        }
      });
    } else if (!(0, _isEqual2.default)(request[property], configCopy.request[property])) {
      throw Error(logger.info('Not able to match request property ' + property + '.' + (' Trying next route. \n\trequest: ' + _util2.default.inspect(request[property])) + ('\n\tconfig: ' + _util2.default.inspect(configCopy.request[property]))));
    }
  });

  // Update logging to use the matched config path
  logger.setPath(config.request.path);

  return configCopy.response.resource;
}