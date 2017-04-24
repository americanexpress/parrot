'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loadSwagger = require('./loadSwagger');

var _loadSwagger2 = _interopRequireDefault(_loadSwagger);

var _validateSwagger = require('./validateSwagger');

var _validateSwagger2 = _interopRequireDefault(_validateSwagger);

var _logValidation = require('./logValidation');

var _logValidation2 = _interopRequireDefault(_logValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swaggerValidator = function swaggerValidator(_ref) {
  var swaggerModel = _ref.swaggerModel,
      _ref$matcher = _ref.matcher,
      matcher = _ref$matcher === undefined ? function () {
    return true;
  } : _ref$matcher,
      outputFn = _ref.outputFn;
  return function (req, res, next) {
    if (matcher(req)) {
      // Grab response body by monkeypatching res.write
      var chunks = [];
      var _originalWrite = res.write;

      res.write = function (chunk) {
        chunks.push(chunk);
        _originalWrite.apply(res, arguments);
      };

      res.on('finish', function () {
        var body = Buffer.concat(chunks).toString('utf8');
        try {
          // Allows handling for swagger schema as either promise or object
          Promise.resolve(swaggerModel).then(function (resolvedModel) {
            var parsedBody = JSON.parse(body);
            var urlParamPath = req.path;
            var method = req.method ? req.method.toLowerCase() : 'get';
            var statusCode = res.statusCode || 200;
            var routeValidation = (0, _validateSwagger2.default)(parsedBody, resolvedModel, urlParamPath, method, statusCode);
            (0, _logValidation2.default)(routeValidation, outputFn);
          });
        } catch (err) {
          console.log('Validator failed due to internal error: ', err);
        }
      });
      next();
    }
  };
};

exports.default = swaggerValidator;