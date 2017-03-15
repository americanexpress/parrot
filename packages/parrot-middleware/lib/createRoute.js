'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createRoute;

var _resolveResponse = require('./resolveResponse');

var _resolveResponse2 = _interopRequireDefault(_resolveResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRoute(router, config, validator, logger) {
  // Set Default Method to HTTP GET
  var method = config.request.method ? config.request.method.toLowerCase() : 'get';
  var statusCode = config.response.statusCode || 200;
  var urlParamPath = config.request.path;

  return router[method](urlParamPath, function (req, res, next) {
    var responseResource = void 0;
    try {
      var app = { req: req, res: res };
      responseResource = (0, _resolveResponse2.default)(config, app, logger);
    } catch (e) {
      console.log(e.message);
      next(); // something didn't match, move on to next route
      return;
    }

    if (validator) {
      try {
        validator(responseResource, config).then(function (routeValidation) {
          // Convert to array if passes back a single error
          var errors = [];
          if (routeValidation.errors) {
            errors = Array.isArray(routeValidation.errors) ? routeValidation.errors : [routeValidation.errors];
          }
          console.log('The route validation found ' + errors.length + ' error(s).');
          errors.forEach(function (err) {
            return console.log(logger.warn(err.message));
          });
        });
      } catch (err) {
        console.log('Validator failed due to internal error: ', err);
      }
    }

    var responseMethod = (typeof responseResource === 'undefined' ? 'undefined' : _typeof(responseResource)) === 'object' ? 'json' : 'send';

    res.status(statusCode);
    if (config.response.delay) {
      setTimeout(function () {
        res[responseMethod](responseResource);
      }, config.response.delay);
    } else {
      res[responseMethod](responseResource);
    }
  });
}