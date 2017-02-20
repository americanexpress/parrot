'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggerColors = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Logging colors
var loggerColors = exports.loggerColors = {
  info: _chalk2.default.white,
  warn: _chalk2.default.yellow,
  error: _chalk2.default.red
};

// Logging templates
var infoTemplate = function infoTemplate(message) {
  return loggerColors.info('Info: ' + message);
};
var errorTemplate = function errorTemplate(message) {
  return loggerColors.error('Error: ' + message);
};
var warnTemplate = function warnTemplate(message) {
  return loggerColors.warn('Warning: ' + message);
};

var LogCreator = function () {
  function LogCreator() {
    _classCallCheck(this, LogCreator);

    this.info = this.baseTemplate(infoTemplate);
    this.error = this.baseTemplate(errorTemplate);
    this.warn = this.baseTemplate(warnTemplate);
  }

  _createClass(LogCreator, [{
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
      return this;
    }
  }, {
    key: 'setPath',
    value: function setPath(path) {
      this.path = path;
      return this;
    }
  }]);

  return LogCreator;
}();

exports.default = LogCreator;