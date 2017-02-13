/* eslint no-unused-expressions: 0 */

import chai, { expect } from 'chai';
import sinon from 'sinon';
import deepmerge from 'deepmerge';
import sinonChai from 'sinon-chai';
import {
  prepareResponse,
  resolveResponse,
  normalizeRouteConfig,
  createRoute,
  __RewireAPI__ as ScenarioRewireAPI
} from '../src/middleware/scenarios';

chai.use(sinonChai);

describe('middleware: scenarios', () => {
  describe('prepareResponse', () => {
    let getResourceSpy;

    beforeEach(() => {
      getResourceSpy = sinon.stub();
      ScenarioRewireAPI.__Rewire__('getResource', getResourceSpy);
    });

    afterEach(() => {
      ScenarioRewireAPI.__ResetDependency__('getResource');
    });

    it('calls getResource with input response if passed a string', () => {
      const mockResponsePath = 'some/path/test.json';
      prepareResponse(mockResponsePath);
      expect(getResourceSpy).to.have.been.calledWith(mockResponsePath);
    });

    it('calls getResource with resource property if passed an object', () => {
      const mockResponseObject = {
        resource: 'some/path/test.json'
      };
      prepareResponse(mockResponseObject);
      expect(getResourceSpy).to.have.been.calledWith(mockResponseObject.resource);
    });

    it('calls getResource with resource property if passed an object', () => {
      const mockResponseObject = {
        resource: 'some/path/test.json'
      };
      prepareResponse(mockResponseObject);
      expect(getResourceSpy).to.have.been.calledWith(mockResponseObject.resource);
    });

    it('merges resource and extends objects if both are passed in config', () => {
      const extendsObj = {
        something: 'wow',
        otherStuff: {
          theBest: 'bigLeague'
        }
      };
      const otherObj = {
        otherStuff: {
          soGreat: 'amaze'
        }
      };
      const mockResponseObject = {
        extends: 'something/cool.json',
        resource: otherObj
      };
      const merged = deepmerge(extendsObj, otherObj);
      getResourceSpy
        .onFirstCall().returns(extendsObj)
        .onSecondCall().returns(otherObj);
      const result = prepareResponse(mockResponseObject);
      expect(result).to.deep.equal(merged);
    });
  });

  describe('resolveResponse', () => {
    let prepareResponseSpy;

    beforeEach(() => {
      prepareResponseSpy = sinon.spy();
      ScenarioRewireAPI.__Rewire__('prepareResponse', prepareResponseSpy);
    });

    afterEach(() => {
      ScenarioRewireAPI.__ResetDependency__('prepareResponse');
    });

    it('can match a config to a request', () => {
      const mockRequest = {
        path: '/account-data/v1/test',
        method: 'get'
      };
      const mockConfig = {
        request: Object.assign({}, mockRequest)
      };
      resolveResponse(mockConfig, mockRequest);
      expect(prepareResponseSpy).to.have.been.called;
    });

    it('throws an error if config does not match', () => {
      const mockRequest = {
        path: '/account-data/v1/test',
        method: 'get'
      };
      const mockConfig = {
        request: {
          path: '/account-data/v1/test',
          method: 'put'
        }
      };
      const errorResolve = resolveResponse.bind(null, mockConfig, mockRequest);
      expect(errorResolve).to.throw(/Not able to match request property method/);
    });

    it('matches headers only if all headers match', () => {
      const mockRequest = {
        path: '/account-data/v1/test',
        headers: {
          test: 'valid',
          other: 'invalid'
        },
        method: 'get'
      };
      const mockConfig = {
        request: Object.assign({}, mockRequest, {
          headers: {
            test: 'invalid'
          }
        })
      };
      const errorResolve = resolveResponse.bind(null, mockConfig, mockRequest);
      expect(errorResolve).to.throw(/Not able to match header test/);
    });
  });

  describe('normalizeRouteConfig', () => {
    it('converts request string shorthand', () => {
      const mockConfig = {
        request: 'api/endpoint/offers',
        response: 'mocks/something.json'
      };
      const { request } = normalizeRouteConfig(Object.assign({}, mockConfig));
      expect(request.method).to.equal('GET');
      expect(request.path).to.equal(mockConfig.request);
    });

    it('converts response string shorthand', () => {
      const mockConfig = {
        request: 'api/endpoint/offers',
        response: 'mocks/something.json'
      };
      const { response } = normalizeRouteConfig(Object.assign({}, mockConfig));
      expect(response.resource).to.equal(mockConfig.response);
    });

    it('throws error if type other than an object or string passed in', () => {
      const mockConfig = {
        request: true,
        response: 'mocks/something.json'
      };
      const boundNormalize = normalizeRouteConfig.bind(null, mockConfig);
      expect(boundNormalize).to.throw(/^Invalid route config/);
    });

    it('throws error if missing request or response property', () => {
      const mockConfig = {
        response: 'mocks/something.json'
      };
      const boundNormalize = normalizeRouteConfig.bind(null, mockConfig);
      expect(boundNormalize).to.throw(/config must be an object with keys/);
    });
  });

  describe('createRoute', () => {
    it('calls next if resolveResponse throws an error', () => {
      const throwError = () => {
        throw Error('Not able to match request property method. Try next route.');
      };
      ScenarioRewireAPI.__Rewire__('resolveResponse', throwError);
      ScenarioRewireAPI.__Rewire__('fetchSwagger', {
        then: cb => { cb('fakeModel'); }
      });
      const res = sinon.spy();
      const next = sinon.spy();
      const mockRouter = {
        get: (path, cb) => {
          cb(null, res, next);
        }
      };
      const mockConfig = {
        request: {
          method: 'GET'
        }
      };
      createRoute(mockRouter, mockConfig);
      expect(next).to.have.been.called;
      expect(res).not.to.have.been.called;
    });

    it('calls res.send if resolveResponse succeeds', () => {
      const mockResponse = 'I am a response';
      ScenarioRewireAPI.__Rewire__('resolveResponse', () => mockResponse);
      ScenarioRewireAPI.__Rewire__('validateAgainstSwagger', () => {});
      ScenarioRewireAPI.__Rewire__('loadSwagger', {
        then: cb => { cb('fakeModel'); }
      });
      const res = {
        status: sinon.spy(),
        send: sinon.spy()
      };
      const next = sinon.spy();
      const mockRouter = {
        get: (path, cb) => {
          cb({}, res, next);
        }
      };
      const mockConfig = {
        request: {
          method: 'GET'
        },
        response: {}
      };
      createRoute(mockRouter, mockConfig);
      expect(next).not.to.have.been.called;
      expect(res.send).to.have.been.calledWith(mockResponse);
    });

    afterEach(() => {
      ScenarioRewireAPI.__ResetDependency__('resolveResponse');
      ScenarioRewireAPI.__ResetDependency__('fetchSwagger');
      ScenarioRewireAPI.__ResetDependency__('validateAgainstSwagger');
    });
  });
});
