import fs from 'fs';
import fetch from 'isomorphic-fetch';

// Path to locally cached swagger JSON
const swaggerDefaultPath = `${__dirname}/.validationSwaggerCache`;

// Attempts to fetch and if successful caches locally
export async function fetchSwagger(swaggerUrl, swaggerPath = swaggerDefaultPath) {
  const response = await fetch(swaggerUrl);
  const swagger = await response.text();
  fs.writeFile(swaggerPath, swagger);
  return swagger;
}

async function loadSwagger(swaggerUrl, swaggerPath = swaggerDefaultPath) {
  let swagger;
  if (!swaggerUrl) {
    throw new Error('Missing swagger JSON url in validator config.');
  }
  try {
    swagger = await fetchSwagger(swaggerUrl);
  } catch (fetchError) {
    try {
      swagger = fs.readFileSync(swaggerPath);
    } catch (readError) {
      throw new Error('Arr! The Swagger definitions could not be fetched and do not exist'
        + ' locally. Your responses will not be validated.');
    }
  }
  try {
    return JSON.parse(swagger);
  } catch (err) {
    throw new Error(`JSON parse failed: ${err}`);
  }
}

export default loadSwagger;
