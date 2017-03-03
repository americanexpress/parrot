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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function translateUrlParams(path) {
  return path.replace(new RegExp(/(\/:)\w+/, 'g'), function (match) {
    return '/{' + match.slice(2) + '}';
  });
}

function validateAgainstSwagger(resolvedResponse, swaggerModel, path, method, responseCode) {
  // If we were not able to load the Swagger model
  if (swaggerModel instanceof Error) {
    return {
      valid: false,
      errors: swaggerModel
    };
  }

  var translatedPath = translateUrlParams(path);
  // NOTE: We currently have cohesion to BaDaaS structure for path check
  // Check will break if we use other swagger or version up
  var pathItem = swaggerModel.paths[translatedPath.slice(path.indexOf('/v1'))];
  if (!pathItem) {
    return {
      valid: false,
      errors: Error('The path provided is not defined in the Swagger: ' + path)
    };
  }

  // Check if mock response has valid responseCode
  var responseObj = pathItem[method.toLowerCase()].responses[responseCode];
  if (!responseObj) {
    return {
      valid: false,
      errors: Error('The response code ' + responseCode + ' is not defined in the Swagger for path: ' + path)
    };
  }

  var model = responseObj.schema;
  if (responseObj.$ref) {
    model = swaggerModel.responses[responseObj.$ref.replace('#/responses/', '')].schema;
  }

  // Ensure emptiness/non-emptiness matches swagger schema
  if (!model && !(0, _isEmpty2.default)(resolvedResponse)) {
    return {
      valid: false,
      errors: Error('The Swagger defined an empty response but the provided' + (' response was non-empty for path: ' + path))
    };
  } else if (model && (0, _isEmpty2.default)(resolvedResponse)) {
    return {
      valid: false,
      errors: Error('The Swagger defined a non-empty response but the provided' + (' response was empty for path: ' + path))
    };
  } else if (!model && (0, _isEmpty2.default)(resolvedResponse)) {
    return {
      valid: true
    };
  }

  // Validate the response against the model
  // The library returns an object with properties that match our validation
  var results = new _swaggerModelValidator2.default().validate(resolvedResponse, model, swaggerModel.definitions, true, true);

  return results;
}