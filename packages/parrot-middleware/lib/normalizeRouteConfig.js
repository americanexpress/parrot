'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = normalizeRouteConfig;

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Converts scenario shorthand into full configs
* request: <urlstring> -> request: { path: <urlstring> }
* response: <HTTP compatible response> -> response: { resource: <HTTP compatible response> }
*/
function normalizeRouteConfig(config) {
  var configCopy = (0, _cloneDeep2.default)(config); // do not modify original config
  if (typeof configCopy.request === 'string') {
    configCopy.request = {
      path: configCopy.request
    };
  }
  if (_typeof(config.response) !== 'object' || typeof config.response.resource === 'undefined') {
    configCopy.response = {
      resource: configCopy.response
    };
  }
  return configCopy;
}