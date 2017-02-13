import fs from 'fs';
import fetch from 'isomorphic-fetch';

const swaggerPath = `${__dirname}/../.validationSwagger`;

async function fetchSwagger() {
  const response = await fetch(process.env.MOCK_MIDDLEWARE_SWAGGER_URL);
  const swagger = await response.text();
  fs.writeFile(swaggerPath, swagger);
  return swagger;
}

async function loadSwagger() {
  let swagger;
  try {
    swagger = await fetchSwagger();
  } catch (fetchError) {
    try {
      swagger = fs.readFileSync(swaggerPath);
    } catch (readError) {
      return Error('Arr! The Swagger definitions could not be fetched and do not exist'
        + ' locally. Your responses will not be validated.');
    }
  }
  try {
    return JSON.parse(swagger);
  } catch (err) {
    return new Error(`JSON parse failed: ${err}`);
  }
}

export default loadSwagger();
