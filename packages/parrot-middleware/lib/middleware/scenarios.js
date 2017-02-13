'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.getResource = getResource;
exports.prepareResponse = prepareResponse;
exports.resolveResponse = resolveResponse;
exports.createRoute = createRoute;
exports.normalizeRouteConfig = normalizeRouteConfig;
exports.default = createMiddlewareForScenario;

var _path = require('path');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _swagger = require('./swagger');

var _swagger2 = _interopRequireDefault(_swagger);

var _loadSwagger = require('../loadSwagger');

var _loadSwagger2 = _interopRequireDefault(_loadSwagger);

var _logUtils = require('../logUtils');

var _logUtils2 = _interopRequireDefault(_logUtils);

var _middlewareConfig = require('../middlewareConfig');

var _middlewareConfig2 = _interopRequireDefault(_middlewareConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function getResource(resource) {
  // for inline defined objects
  if ((typeof resource === 'undefined' ? 'undefined' : (0, _typeof3.default)(resource)) === 'object') {
    return resource;
  }

  try {
    var componentMocksDir = _fs2.default.realpathSync((0, _path.resolve)(process.cwd(), 'mocks'));
    var localPath = (0, _path.resolve)(componentMocksDir, '..', resource);
    var prefixedPath = (0, _path.resolve)(componentMocksDir, '..', 'node_modules', _middlewareConfig2.default.config.pluginPrefix + '-' + resource);
    var modulePath = (0, _path.resolve)(componentMocksDir, '..', 'node_modules', resource);
    console.log(localPath, prefixedPath, modulePath);
    // First try to load the mock as a local resource
    if (_fs2.default.existsSync(localPath)) {
      return JSON.parse(_fs2.default.readFileSync(localPath));
    } else if (_fs2.default.existsSync(prefixedPath)) {
      // Next try to load as a prefixed module
      return JSON.parse(_fs2.default.readFileSync(prefixedPath));
    }
    // Last try to load as a non-prefixed module
    return JSON.parse(_fs2.default.readFileSync(modulePath));
  } catch (err) {
    console.log(err);
    throw Error(_logUtils2.default.error('File system error.'));
  }
}

function prepareResponse(config) {
  if (typeof config === 'string') {
    return getResource(config);
  } else if ((typeof config === 'undefined' ? 'undefined' : (0, _typeof3.default)(config)) === 'object') {
    if (config.extends) {
      return (0, _deepmerge2.default)(getResource(config.extends), getResource(config.resource));
    }
    return getResource(config.resource);
  }
  throw Error(_logUtils2.default.error('Response config must be of type string or object.' + (' Got ' + (typeof config === 'undefined' ? 'undefined' : (0, _typeof3.default)(config)) + ' instead.')));
}

function resolveResponse(config, request) {
  var configCopy = (0, _cloneDeep2.default)(config); // do not modify original config
  /* eslint-disable guard-for-in */
  if (!(0, _isEmpty2.default)(request.params)) {
    var resource = configCopy.response.resource;
    var path = configCopy.request.path;
    for (var param in request.params) {
      if (typeof resource === 'string') {
        resource = resource.replace(':' + param, request.params[param]);
      }
      path = path.replace(':' + param, request.params[param]);
    }
    configCopy.response.resource = resource;
    configCopy.request.path = path;
  }

  for (var property in configCopy.request) {
    if (property === 'headers') {
      for (var header in configCopy.request.headers) {
        if (request.headers[header] !== configCopy.request.headers[header]) {
          throw Error(_logUtils2.default.info('Not able to match header ' + header + '. Try next route.'));
        }
      }
    } else if (!(0, _isEqual2.default)(request[property], configCopy.request[property])) {
      throw Error(_logUtils2.default.info('Not able to match request property ' + property + '.' + (' Trying next route. \n\trequest: ' + _util2.default.inspect(request[property])) + ('\n\tconfig: ' + _util2.default.inspect(configCopy.request[property]))));
    }
  }

  // Update logging to use the matched config path
  _logUtils2.default.setPath(config.request.path);

  return prepareResponse(configCopy.response);
  /* eslint-enable guard-for-in */
}

function createRoute(router, config) {
  var method = config.request.method.toLowerCase();
  var urlParamPath = config.request.path;
  router[method](config.request.path, function (req, res, next) {
    var response = void 0;
    try {
      response = resolveResponse(config, req, next);
    } catch (e) {
      console.log(e.message);
      next(); // something didn't match, move on to next route
      return;
    }

    _loadSwagger2.default.then(function (swaggerModel) {
      try {
        (0, _swagger2.default)(response, swaggerModel, urlParamPath, method, config.response.statusCode || 200);
      } catch (e) {
        console.log(_logUtils2.default.swagger('Swagger validation resulted in an error:\n          ' + e.message + '\nCheck that your scenarios and Swagger are valid.'));
      }

      res.status(config.response.statusCode || 200);
      if (config.response.delay) {
        setTimeout(function () {
          res.send(response);
        }, config.response.delay);
      } else {
        res.send(response);
      }
    });
  });
}

function normalizeRouteConfig(config) {
  var keys = (0, _keys2.default)(config);
  if (keys.indexOf('request') === -1 || keys.indexOf('response') === -1) {
    throw Error('Your request config must be an object with keys `request` and `response`.');
  }
  /* eslint-disable guard-for-in */
  for (var key in config) {
    if (typeof config[key] === 'string') {
      config[key] = (0, _defineProperty3.default)({}, key === 'request' ? 'path' : 'resource', config[key]);
    } else if ((0, _typeof3.default)(config[key]) !== 'object') {
      throw Error('Invalid route config.  ' + key + ' must be of type \'string\' or \'object\'.\n        Got ' + (0, _typeof3.default)(config[key]));
    }
  }

  config.request.method = config.request.method || 'GET';
  return config;
  /* eslint-enable guard-for-in */
}

function createMiddlewareForScenario(middlewareConfig) {
  _middlewareConfig2.default.config = middlewareConfig;
  return function (app) {
    var router = void 0;
    var absolutePath = (0, _path.normalize)('' + process.cwd() + _middlewareConfig2.default.config.scenarios);
    var relativePath = (0, _path.relative)(__dirname, absolutePath);
    var scenarios = require(relativePath);
    function createRoutesForScenario(scenario) {
      router = (0, _express.Router)();
      scenario.forEach(function (config) {
        try {
          createRoute(router, normalizeRouteConfig(config));
        } catch (e) {
          console.error(e.message);
        }
      });
      // catch all with 404
      router.get('/account-data/*', function (req, res) {
        _logUtils2.default.setPath(req.path);
        console.error(_logUtils2.default.error('Route failed. If there are no other errors, you have not' + ' defined this route.'));

        res.status(404).send({
          error: 'Could not return mock data for: ' + req.path
        });
      });
    }

    function setActiveScenario(scenarioName) {
      _logUtils2.default.setScenario(scenarioName);
      createRoutesForScenario(scenarios[scenarioName]);
      return scenarioName;
    }

    var activeScenarioName = setActiveScenario((0, _keys2.default)(scenarios)[0]);

    app.use((0, _cors2.default)());
    app.use(_bodyParser2.default.json());
    app.use(function (req, res, next) {
      router(req, res, next);
    });

    app.post('/scenario', function (req, res) {
      activeScenarioName = setActiveScenario(req.body.scenario);
      res.sendStatus(200);
    });

    app.get('/scenario', function (req, res) {
      res.json(activeScenarioName);
    });

    app.get('/scenarios', function (req, res) {
      res.json(scenarios);
    });
  };
}