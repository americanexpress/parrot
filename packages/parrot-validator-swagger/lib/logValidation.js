"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var logValidation = function logValidation(routeValidation, outputFn) {
  var errors = [];
  if (routeValidation.errors) {
    errors = Array.isArray(routeValidation.errors) ? routeValidation.errors : [routeValidation.errors];
  }
  outputFn("The route validation found " + errors.length + " error(s).");
  errors.forEach(function (err) {
    return outputFn(err.message);
  });
};

exports.default = logValidation;