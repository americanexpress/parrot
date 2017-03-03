'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSwagger = undefined;

// Attempts to fetch and if successful caches locally
var fetchSwagger = exports.fetchSwagger = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(swaggerUrl) {
    var swaggerPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : swaggerDefaultPath;
    var response, swagger;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _isomorphicFetch2.default)(swaggerUrl);

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.text();

          case 5:
            swagger = _context.sent;

            _fs2.default.writeFile(swaggerPath, swagger);
            return _context.abrupt('return', swagger);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchSwagger(_x) {
    return _ref.apply(this, arguments);
  };
}();

var loadSwagger = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(swaggerUrl) {
    var swaggerPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : swaggerDefaultPath;
    var swagger;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            swagger = void 0;

            if (swaggerUrl) {
              _context2.next = 3;
              break;
            }

            throw new Error('Missing swagger JSON url in validator config.');

          case 3:
            _context2.prev = 3;
            _context2.next = 6;
            return fetchSwagger(swaggerUrl);

          case 6:
            swagger = _context2.sent;
            _context2.next = 18;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](3);
            _context2.prev = 11;

            swagger = _fs2.default.readFileSync(swaggerPath);
            _context2.next = 18;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t1 = _context2['catch'](11);
            throw new Error('Arr! The Swagger definitions could not be fetched and do not exist' + ' locally. Your responses will not be validated.');

          case 18:
            _context2.prev = 18;
            return _context2.abrupt('return', JSON.parse(swagger));

          case 22:
            _context2.prev = 22;
            _context2.t2 = _context2['catch'](18);
            throw new Error('JSON parse failed: ' + _context2.t2);

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 9], [11, 15], [18, 22]]);
  }));

  return function loadSwagger(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Path to locally cached swagger JSON
var swaggerDefaultPath = __dirname + '/.validationSwaggerCache';exports.default = loadSwagger;