# parrot-validator-swagger

An express middleware that validates a response body against a Swagger schema.

It uses the npm package [swagger-model-validator](https://github.com/atlantishealthcare/swagger-model-validator) for schema matching.

## Options

* swaggerModel (Object|Promise) - Swagger Schema
* matcher (Function) - Function to determine if response should be validated

## Example

```javascript
const SWAGGER_URL = 'http://myapi.com/schema';

const validator = swaggerValidator({
  swaggerModel: fetch(SWAGGER_URL).then((data) => data.json()),
  matcher: (req) => !!req.path.match(/api\/v1/),
}));
validator(app);
```
