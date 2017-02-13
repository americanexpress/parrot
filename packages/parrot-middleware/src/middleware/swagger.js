import SwaggerValidator from 'swagger-model-validator';
import isEmpty from 'lodash/isEmpty';
import LogCreator, { loggerColors } from '../logUtils';

function logSwaggerErrors(errors) {
  let output = LogCreator.swagger('Your response has' +
    ` ${errors.length} issues with the definition:\n`);

  errors.forEach((message, index) => {
    const displayIndex = `      [${index}]`.slice(-6);
    output += `\t${loggerColors.info(displayIndex)} ${loggerColors.swagger(message)}\n`;
  });

  output += loggerColors.swagger('\tDouble check the data controller API'
    + ' (https://stash.aexp.com/stash/projects/FA/repos/api/browse)'
    + ' to make sure your response structure is correct.');
  console.log(output);
}

export function translateUrlParams(path) {
  return path.replace(new RegExp(/(\/:)\w+/, 'g'), match => `/{${match.slice(2)}}`);
}

export default function validateAgainstSwagger(response, swaggerModel, path, method, responseCode) {
  // If we were not able to load the Swagger model
  if (swaggerModel instanceof Error) {
    console.log(LogCreator.swagger(swaggerModel));
    return;
  }

  const translatedPath = translateUrlParams(path);
  const pathItem = swaggerModel.paths[translatedPath.slice(path.indexOf('/v1'))];
  if (!pathItem) {
    logSwaggerErrors(['The path provided is not defined in the Swagger'], path);
    return;
  }

  const responseObj = pathItem[method.toLowerCase()].responses[responseCode];
  if (!responseObj) {
    logSwaggerErrors([`The response code ${responseCode} is not defined in the Swagger`], path);
    return;
  }

  let model = responseObj.schema;
  if (responseObj.$ref) {
    model = swaggerModel.responses[responseObj.$ref.replace('#/responses/', '')].schema;
  }

  if (!model && !isEmpty(response)) {
    logSwaggerErrors(['The Swagger defined an empty response but the provided'
    + ' response was non-empty'], path);
    return;
  } else if (model && isEmpty(response)) {
    logSwaggerErrors(['The Swagger defined a non-empty response but the provided'
    + ' response was empty'], path);
    return;
  } else if (!model && isEmpty(response)) {
    return;
  }

  // Validate the response against the model
  const results = new SwaggerValidator().validate(response, model,
    swaggerModel.definitions, true, true);

  // Output the results of the validations
  if (results.errorCount) {
    logSwaggerErrors(results.GetErrorMessages());
  }
}
