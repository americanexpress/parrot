/* eslint no-unused-expressions: 0 */

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import validateAgainstSwagger, { translateUrlParams } from '../src/middleware/swagger';

chai.use(sinonChai);

const swagger = {
  paths: {
    '/v1/path': {
      get: {
        responses: {}
      }
    }
  }
};

describe('middleware: swagger', () => {
  describe('validateAgainstSwagger', () => {
    const consoleLogSpy = sinon.spy(console, 'log');

    it('should log if passed an Error', () => {
      const error = new Error('Uh oh!');
      validateAgainstSwagger({}, error, '', 'GET', {});
      expect(consoleLogSpy).to.have.been.called;
    });

    it('should log if path not in swagger', () => {
      validateAgainstSwagger({}, { paths: {} }, '/path', 'GET', {}, 200);
      expect(consoleLogSpy).to.have.been.called;
    });

    it('should log if response code not in swagger', () => {
      validateAgainstSwagger({}, swagger, '/v1/path', 'GET', 200);
      expect(consoleLogSpy).to.have.been.called;
    });

    it('should log if empty response, non-empty swagger', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {
          schema: {
            notEmpty: true
          }
        }
      };
      validateAgainstSwagger({}, swagger, '/v1/path', 'GET', 200);
      expect(consoleLogSpy).to.have.been.called;
    });

    it('should log if non-empty response, empty swagger', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {}
      };
      validateAgainstSwagger({ notEmpty: true }, swagger, '/v1/path', 'GET', 200);
      expect(consoleLogSpy).to.have.been.called;
    });

    it('should log if there are validation errors', () => {
      swagger.paths['/v1/path'].get.responses = {
        200: {
          schema: {
            properties: {
              someBoolean: {
                type: 'boolean'
              }
            }
          }
        }
      };
      validateAgainstSwagger({ someBoolean: 'not a boolean' }, swagger, '/v1/path', 'GET', 200);
      expect(consoleLogSpy).to.have.been.called;
    });
  });

  describe('translateUrlParams', () => {
    it('should translate express url', () => {
      const translatedUrl = translateUrlParams('v1/path/:id/path/:id');
      expect(translatedUrl).to.equal('v1/path/{id}/path/{id}');
    });
  });
});
