import fs from 'fs';
import fetch from 'isomorphic-fetch';

// Path to locally cached swagger JSON
const swaggerDefaultPath = `${__dirname}/.validationSwaggerCache`;

// Attempts to fetch and if successful caches locally
async function fetchSwagger(swaggerUrl = process.env.MOCK_MIDDLEWARE_SWAGGER_URL) {
  const response = await fetch(swaggerUrl);
  const swagger = await response.text();
  fs.writeFile(swaggerPath, swagger);
  return swagger;
}

async function loadSwagger(swaggerPath = swaggerDefaultPath) {
  let swagger;
  try {
    swagger = await fetchSwagger();
  } catch (fetchError) {
    try {
      swagger = fs.readFileSync(swaggerPath);
    } catch (readError) {
      throw new Error('Arr! The Swagger definitions could not be fetched and do not exist'
        + ' locally. Your responses will not be validated.')
    }
  }
  try {
    return JSON.parse(swagger);
  } catch (err) {
    throw new Error(`JSON parse failed: ${err}`);
  }
}

export default loadSwagger;
