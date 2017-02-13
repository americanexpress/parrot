/* eslint-disable no-param-reassign */
import { normalize, relative, resolve as pathResolve } from 'path';
import util from 'util';

import deepmerge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

import { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import fs from 'fs';
import validateAgainstSwagger from './swagger';
import loadSwagger from '../loadSwagger';
import LogCreator from '../logUtils';
import MiddlewareConfig from '../middlewareConfig';

export function getResource(resource) {
  // for inline defined objects
  if (typeof resource === 'object') {
    return resource;
  }

  try {
    const componentMocksDir = fs.realpathSync(pathResolve(process.cwd(), 'mocks'));
    const localPath = pathResolve(componentMocksDir, '..', resource);
    const prefixedPath = pathResolve(componentMocksDir, '..', 'node_modules',
      `${MiddlewareConfig.config.pluginPrefix}-${resource}`);
    const modulePath = pathResolve(componentMocksDir, '..', 'node_modules', resource);
    // First try to load the mock as a local resource
    if (fs.existsSync(localPath)) {
      return JSON.parse(fs.readFileSync(localPath));
    } else if (fs.existsSync(prefixedPath)) { // Next try to load as a prefixed module
      return JSON.parse(fs.readFileSync(prefixedPath));
    }
    // Last try to load as a non-prefixed module
    return JSON.parse(fs.readFileSync(modulePath));
  } catch (err) {
    console.log(err);
    throw Error(LogCreator.error('File system error.'));
  }
}

export function prepareResponse(config) {
  if (typeof config === 'string') {
    return getResource(config);
  } else if (typeof config === 'object') {
    if (config.extends) {
      return deepmerge(getResource(config.extends), getResource(config.resource));
    }
    return getResource(config.resource);
  }
  throw Error(LogCreator.error('Response config must be of type string or object.'
  + ` Got ${typeof config} instead.`));
}

export function resolveResponse(config, request) {
  const configCopy = cloneDeep(config); // do not modify original config
  /* eslint-disable guard-for-in */
  if (!isEmpty(request.params)) {
    let resource = configCopy.response.resource;
    let path = configCopy.request.path;
    for (const param in request.params) {
      if (typeof resource === 'string') {
        resource = resource.replace(`:${param}`, request.params[param]);
      }
      path = path.replace(`:${param}`, request.params[param]);
    }
    configCopy.response.resource = resource;
    configCopy.request.path = path;
  }

  for (const property in configCopy.request) {
    if (property === 'headers') {
      for (const header in configCopy.request.headers) {
        if (request.headers[header] !== configCopy.request.headers[header]) {
          throw Error(LogCreator.info(`Not able to match header ${header}. Try next route.`));
        }
      }
    } else if (!isEqual(request[property], configCopy.request[property])) {
      throw Error(LogCreator.info(`Not able to match request property ${property}.`
        + ` Trying next route. \n\trequest: ${util.inspect(request[property])}`
        + `\n\tconfig: ${util.inspect(configCopy.request[property])}`));
    }
  }

  // Update logging to use the matched config path
  LogCreator.setPath(config.request.path);

  return prepareResponse(configCopy.response);
  /* eslint-enable guard-for-in */
}

export function createRoute(router, config) {
  const method = config.request.method.toLowerCase();
  const urlParamPath = config.request.path;
  router[method](config.request.path, (req, res, next) => {
    let response;
    try {
      response = resolveResponse(config, req, next);
    } catch (e) {
      console.log(e.message);
      next(); // something didn't match, move on to next route
      return;
    }

    loadSwagger.then((swaggerModel) => {
      try {
        validateAgainstSwagger(response, swaggerModel,
          urlParamPath, method, config.response.statusCode || 200);
      } catch (e) {
        console.log(LogCreator.swagger(`Swagger validation resulted in an error:
          ${e.message}\nCheck that your scenarios and Swagger are valid.`));
      }

      res.status(config.response.statusCode || 200);
      if (config.response.delay) {
        setTimeout(() => {
          res.send(response);
        }, config.response.delay);
      } else {
        res.send(response);
      }
    });
  });
}

export function normalizeRouteConfig(config) {
  const keys = Object.keys(config);
  if (keys.indexOf('request') === -1 || keys.indexOf('response') === -1) {
    throw Error('Your request config must be an object with keys `request` and `response`.');
  }
  /* eslint-disable guard-for-in */
  for (const key in config) {
    if (typeof config[key] === 'string') {
      config[key] = {
        [key === 'request' ? 'path' : 'resource']: config[key]
      };
    } else if (typeof config[key] !== 'object') {
      throw Error(`Invalid route config.  ${key} must be of type 'string' or 'object'.
        Got ${typeof config[key]}`);
    }
  }

  config.request.method = config.request.method || 'GET';
  return config;
  /* eslint-enable guard-for-in */
}

export default function createMiddlewareForScenario(middlewareConfig) {
  MiddlewareConfig.config = middlewareConfig;
  return (app) => {
    let router;
    const absolutePath = normalize(`${process.cwd()}${MiddlewareConfig.config.scenarios}`);
    const relativePath = relative(__dirname, absolutePath);
    const scenarios = require(relativePath);
    function createRoutesForScenario(scenario) {
      router = Router();
      scenario.forEach((config) => {
        try {
          createRoute(router, normalizeRouteConfig(config));
        } catch (e) {
          console.error(e.message);
        }
      });
      // catch all with 404
      router.get('/account-data/*', (req, res) => {
        LogCreator.setPath(req.path);
        console.error(LogCreator.error('Route failed. If there are no other errors, you have not'
          + ' defined this route.'));

        res.status(404).send({
          error: `Could not return mock data for: ${req.path}`
        });
      });
    }

    function setActiveScenario(scenarioName) {
      LogCreator.setScenario(scenarioName);
      createRoutesForScenario(scenarios[scenarioName]);
      return scenarioName;
    }

    let activeScenarioName = setActiveScenario(Object.keys(scenarios)[0]);

    app.use(cors());
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      router(req, res, next);
    });

    app.post('/scenario', (req, res) => {
      activeScenarioName = setActiveScenario(req.body.scenario);
      res.sendStatus(200);
    });

    app.get('/scenario', (req, res) => {
      res.json(activeScenarioName);
    });

    app.get('/scenarios', (req, res) => {
      res.json(scenarios);
    });
  };
}
