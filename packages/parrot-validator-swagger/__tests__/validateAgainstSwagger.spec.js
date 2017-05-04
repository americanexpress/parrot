import validateAgainstSwagger, { translateUrlParams } from '../src/validateAgainstSwagger';

describe('Spec: validateSwagger', () => {
  describe('translateUrlParams', () => {
    it('converts param names from express to swagger syntax', () => {
      const originalPath = '/test/:account/:id';
      const expectedPath = '/test/{account}/{id}';
      expect(translateUrlParams(originalPath)).toEqual(expectedPath);
    });
  });

  describe('validateAgainstSwagger', () => {
    let swagger;
    beforeEach(() => {
      swagger = {
        paths: {
          '/v1/path': {
            get: {
              responses: {},
            },
          },
        },
      };
    });

    it('should return invalid if swagger model is an error', () => {
      const error = new Error('Uh oh!');
      const result = validateAgainstSwagger({}, error, '', 'GET', {});
      expect(result).toEqual({
        valid: false,
        errors: error,
      });
    });

    it('should return invalid if path not in swagger', () => {
      const result = validateAgainstSwagger({}, { paths: {} }, '/path', 'GET', {}, 200);
      expect(result.valid).toEqual(false);
      expect(result.errors.message).toMatch(/^The path provided is not defined in the Swagger:/);
    });

    it('should return invalid if response code not found in swagger for the path', () => {
      const result = validateAgainstSwagger({}, swagger, '/v1/path', 'GET', 200);
      expect(result.valid).toEqual(false);
      expect(result.errors.message).toMatch(/^The response code 200 is not defined in the Swagger/);
    });

    it('should return invalid if empty response, non-empty swagger', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {
          schema: {
            notEmpty: true,
          },
        },
      };
      const result = validateAgainstSwagger({}, swagger, '/v1/path', 'GET', 200);
      expect(result.valid).toEqual(false);
      expect(result.errors.message).toMatch(
        /^The Swagger defined a non-empty response but the provided response was empty for path/,
      );
    });

    it('should return invalid if non-empty response, empty swagger', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {},
      };
      const result = validateAgainstSwagger({ notEmpty: true }, swagger, '/v1/path', 'GET', 200);
      expect(result.valid).toEqual(false);
      expect(result.errors.message).toMatch(
        /^The Swagger defined an empty response but the provided response was non-empty for path/,
      );
    });

    it('should return invalid if there are validation errors', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {
          schema: {
            properties: {
              someBoolean: {
                type: 'boolean',
              },
            },
          },
        },
      };
      const result = validateAgainstSwagger(
        { someBoolean: 'not a boolean' },
        swagger,
        '/v1/path',
        'GET',
        200,
      );
      expect(result.valid).toEqual(false);
      expect(result.errors[0].message).toEqual(
        'someBoolean (not a boolean) is not a type of boolean',
      );
    });

    it('can validate against $ref response schemas', () => {
      swagger.paths['/v1/path'].get.responses = {
        404: {
          $ref: '#/responses/404',
        },
      };
      swagger.responses = {
        404: {
          description: 'Not Found / Unauthorized / Forbidden',
        },
      };
      const result = validateAgainstSwagger({}, swagger, '/v1/path', 'GET', 404);
      expect(result.valid).toEqual(true);
    });

    it('should return valid if there is an empty response and empty swagger', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {},
      };
      const result = validateAgainstSwagger({}, swagger, '/v1/path', 'GET', 200);
      expect(result.valid).toEqual(true);
    });
  });
});
