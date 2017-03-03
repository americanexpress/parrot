'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SwaggerValidator;

var _loadSwagger = require('./loadSwagger');

var _loadSwagger2 = _interopRequireDefault(_loadSwagger);

var _validateSwagger = require('./validateSwagger');

var _validateSwagger2 = _interopRequireDefault(_validateSwagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SwaggerValidator(validatorConfig) {
  var swaggerUrl = validatorConfig.swaggerUrl,
      swaggerCachePath = validatorConfig.swaggerCachePath;


  return function validator(resolvedResponse, routeConfig) {
    var urlParamPath = routeConfig.request.path;
    var method = routeConfig.request.method.toLowerCase();
    var statusCode = routeConfig.response.statusCode || 200;
    return (0, _loadSwagger2.default)(swaggerUrl, swaggerCachePath).then(function (swaggerModel) {
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
}