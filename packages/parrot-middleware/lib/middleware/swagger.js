'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translateUrlParams = translateUrlParams;
exports.default = validateAgainstSwagger;

var _swaggerModelValidator = require('swagger-model-validator');

var _swaggerModelValidator2 = _interopRequireDefault(_swaggerModelValidator);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _logUtils = require('../logUtils');

var _logUtils2 = _interopRequireDefault(_logUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logSwaggerErrors(errors) {
  var output = _logUtils2.default.swagger('Your response has' + (' ' + errors.length + ' issues with the definition:\n'));

  errors.forEach(function (message, index) {
    var displayIndex = ('      [' + index + ']').slice(-6);
    output += '\t' + _logUtils.loggerColors.info(displayIndex) + ' ' + _logUtils.loggerColors.swagger(message) + '\n';
  });

  output += _logUtils.loggerColors.swagger('\tDouble check the data controller API' + ' (https://stash.aexp.com/stash/projects/FA/repos/api/browse)' + ' to make sure your response structure is correct.');
  console.log(output);
}

function translateUrlParams(path) {
  return path.replace(new RegExp(/(\/:)\w+/, 'g'), function (match) {
    return '/{' + match.slice(2) + '}';
  });
}

function validateAgainstSwagger(response, swaggerModel, path, method, responseCode) {
  // If we were not able to load the Swagger model
  if (swaggerModel instanceof Error) {
    console.log(_logUtils2.default.swagger(swaggerModel));
    return;
  }

  var translatedPath = translateUrlParams(path);
  var pathItem = swaggerModel.paths[translatedPath.slice(path.indexOf('/v1'))];
  if (!pathItem) {
    logSwaggerErrors(['The path provided is not defined in the Swagger'], path);
    return;
  }

  var responseObj = pathItem[method.toLowerCase()].responses[responseCode];
  if (!responseObj) {
    logSwaggerErrors(['The response code ' + responseCode + ' is not defined in the Swagger'], path);
    return;
  }

  var model = responseObj.schema;
  if (responseObj.$ref) {
    model = swaggerModel.responses[responseObj.$ref.replace('#/responses/', '')].schema;
  }

  if (!model && !(0, _isEmpty2.default)(response)) {
    logSwaggerErrors(['The Swagger defined an empty response but the provided' + ' response was non-empty'], path);
    return;
  } else if (model && (0, _isEmpty2.default)(response)) {
    logSwaggerErrors(['The Swagger defined a non-empty response but the provided' + ' response was empty'], path);
    return;
  } else if (!model && (0, _isEmpty2.default)(response)) {
    return;
  }

  // Validate the response against the model
  var results = new _swaggerModelValidator2.default().validate(response, model, swaggerModel.definitions, true, true);

  // Output the results of the validations
  if (results.errorCount) {
    logSwaggerErrors(results.GetErrorMessages());
  }
}