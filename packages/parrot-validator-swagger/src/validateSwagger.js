import SwaggerValidator from 'swagger-model-validator';
import isEmpty from 'lodash/isEmpty';

export function translateUrlParams(path) {
  return path.replace(new RegExp(/(\/:)\w+/, 'g'), match => `/{${match.slice(2)}}`);
}

export default function
  validateAgainstSwagger(resolvedResponse, swaggerModel, path, method, responseCode) {
  // If we were not able to load the Swagger model
  if (swaggerModel instanceof Error) {
    return {
      valid: false,
      errors: swaggerModel,
    };
  }

  const translatedPath = translateUrlParams(path);
  // NOTE: We currently have cohesion to BaDaaS structure for path check
  // Check will break if we use other swagger or version up
  const pathItem = swaggerModel.paths[translatedPath.slice(path.indexOf('/v1'))];
  if (!pathItem) {
    return {
      valid: false,
      errors: Error(`The path provided is not defined in the Swagger: ${path}`),
    };
  }

  // Check if mock response has valid responseCode
  const responseObj = pathItem[method.toLowerCase()].responses[responseCode];
  if (!responseObj) {
    return {
      valid: false,
      errors: Error(`The response code ${responseCode} is not defined in the Swagger for path: ${path}`),
    };
  }

  let model = responseObj.schema;
  if (responseObj.$ref) {
    model = swaggerModel.responses[responseObj.$ref.replace('#/responses/', '')].schema;
  }

  // Ensure emptiness/non-emptiness matches swagger schema
  if (!model && !isEmpty(resolvedResponse)) {
    return {
      valid: false,
      errors: Error('The Swagger defined an empty response but the provided'
        + ` response was non-empty for path: ${path}`),
    };
  } else if (model && isEmpty(resolvedResponse)) {
    return {
      valid: false,
      errors: Error('The Swagger defined a non-empty response but the provided'
        + ` response was empty for path: ${path}`),
    };
  } else if (!model && isEmpty(resolvedResponse)) {
    return {
      valid: true,
    };
  }

  // Validate the response against the model
  // The library returns an object with properties that match our validation
  const results = new SwaggerValidator().validate(resolvedResponse, model,
    swaggerModel.definitions, true, true);

  return results;
}
