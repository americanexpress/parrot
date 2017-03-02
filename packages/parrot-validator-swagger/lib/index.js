'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (resolvedResponse, config) {
  var urlParamPath = config.request.path;
  var method = config.request.method.toLowerCase();
  var statusCode = config.response.statusCode || 200;
  (0, _loadSwagger2.default)().then(function (swaggerModel) {
    try {
      return (0, _validateSwagger2.default)(resolvedResponse, swaggerModel, urlParamPath, method, statusCode);
    } catch (err) {
      return {
        valid: false,
        errors: err
      };
    }
  });
};

var _loadSwagger = require('./loadSwagger');

var _loadSwagger2 = _interopRequireDefault(_loadSwagger);

var _validateSwagger = require('./validateSwagger');

var _validateSwagger2 = _interopRequireDefault(_validateSwagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }