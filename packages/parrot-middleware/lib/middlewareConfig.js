'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MiddlewareConfig = function () {
  function MiddlewareConfig() {
    (0, _classCallCheck3.default)(this, MiddlewareConfig);
  }

  (0, _createClass3.default)(MiddlewareConfig, [{
    key: 'config',
    set: function set(val) {
      if (!this._config) {
        this._config = val;
      } else {
        throw Error('Initial config value shouldn\'t be mutated!');
      }
    },
    get: function get() {
      return this._config;
    }
  }]);
  return MiddlewareConfig;
}();

exports.default = new MiddlewareConfig();