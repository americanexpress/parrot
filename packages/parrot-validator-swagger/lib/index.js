'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _validateAgainstSwagger = require('./validateAgainstSwagger');

var _validateAgainstSwagger2 = _interopRequireDefault(_validateAgainstSwagger);

var _logValidation = require('./logValidation');

var _logValidation2 = _interopRequireDefault(_logValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swaggerValidator = function swaggerValidator(_ref) {
  var swaggerModel = _ref.swaggerModel,
      _ref$matcher = _ref.matcher,
      matcher = _ref$matcher === undefined ? function () {
    return true;
  } : _ref$matcher,
      _ref$outputFn = _ref.outputFn,
      outputFn = _ref$outputFn === undefined ? function (txt) {
    return console.log(_chalk2.default.yellow(txt));
  } : _ref$outputFn;
  return function (req, res, next) {
    if (matcher(req)) {
      // Grab response body by monkeypatching res.write
      var chunks = [];
      var originalWrite = res.write;

      res.write = function (chunk) {
        // eslint-disable-line no-param-reassign
        chunks.push(chunk);
        originalWrite.apply(res, arguments); // eslint-disable-line prefer-rest-params
      };

      res.on('finish', function () {
        var body = Buffer.concat(chunks).toString('utf8');

        // Allows handling for swagger schema as either promise or object
        return Promise.resolve(swaggerModel).then(function (resolvedModel) {
          var parsedBody = JSON.parse(body);
          var urlParamPath = req.path;
          var method = req.method ? req.method.toLowerCase() : 'get';
          var statusCode = res.statusCode || 200;
          var routeValidation = (0, _validateAgainstSwagger2.default)(parsedBody, resolvedModel, urlParamPath, method, statusCode);
          (0, _logValidation2.default)(routeValidation, outputFn);
        }).catch(function (err) {
          outputFn('Validator failed due to internal error: ', err);
        });
      });
    }
    next();
  };
};

exports.default = swaggerValidator;