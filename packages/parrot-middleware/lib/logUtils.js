'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggerColors = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Logging colors
var loggerColors = exports.loggerColors = {
  info: _chalk2.default.white,
  error: _chalk2.default.red,
  swagger: _chalk2.default.yellow
};

// Logging templates
var infoTemplate = function infoTemplate(message) {
  return loggerColors.info('Info: ' + message);
};
var errorTemplate = function errorTemplate(message) {
  return loggerColors.error('Error: ' + message);
};
var swaggerTemplate = function swaggerTemplate(message) {
  return loggerColors.swagger('Swagger: ' + message);
};

var LogCreator = function () {
  function LogCreator() {
    (0, _classCallCheck3.default)(this, LogCreator);

    this.info = this.baseTemplate(infoTemplate);
    this.error = this.baseTemplate(errorTemplate);
    this.swagger = this.baseTemplate(swaggerTemplate);
  }

  (0, _createClass3.default)(LogCreator, [{
    key: 'baseTemplate',
    value: function baseTemplate(template) {
      var _this = this;

      return function (message) {
        return '[Parrot] ' + _chalk2.default.underline(_this.path) + (' ' + _chalk2.default.dim('(' + _this.scenario + ')') + '\n\t' + template(message));
      };
    }
  }, {
    key: 'setScenario',
    value: function setScenario(scenario) {
      this.scenario = scenario;
    }
  }, {
    key: 'setPath',
    value: function setPath(path) {
      this.path = path;
    }
  }]);
  return LogCreator;
}();

exports.default = new LogCreator();