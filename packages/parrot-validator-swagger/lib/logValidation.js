'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logValidation = function logValidation(routeValidation) {
  var outputFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (txt) {
    return console.log(_chalk2.default.yellow('\n' + txt + '\n'));
  };

  var errors = [];
  if (routeValidation.errors) {
    errors = Array.isArray(routeValidation.errors) ? routeValidation.errors : [routeValidation.errors];
  }
  outputFn('The route validation found ' + errors.length + ' error(s).');
  errors.forEach(function (err) {
    return outputFn(err.message);
  });
};

exports.default = logValidation;