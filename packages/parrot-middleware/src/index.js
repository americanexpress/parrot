/* eslint-disable no-param-reassign */
import { Router } from 'express';
import bodyParser from 'body-parser';
import registerMiddleware from 'parrot-registry';

import LogCreator from './utils/logging';
import validateRouteConfig from './validateRouteConfig';
import normalizeRouteConfig from './normalizeRouteConfig';
import createRoute from './createRoute';

export default function createMiddlewareForScenario({ scenarios }) {
  return (app) => {
    const logger = new LogCreator();
    let router;
    function createRoutesForScenario(scenario, routeValidator) {
      router = Router();
      scenario.forEach((config) => {
        try {
          validateRouteConfig(config);
          createRoute(router, normalizeRouteConfig(config), routeValidator, logger);
        } catch (e) {
          console.error(e.message);
        }
      });
    }

    function setActiveScenario(scenarioName) {
      logger.setScenario(scenarioName);
      createRoutesForScenario(scenarios[scenarioName]);
      return scenarioName;
    }

    let activeScenarioName = setActiveScenario(Object.keys(scenarios)[0]);

    app.use(bodyParser.json());
    app.use((req, res, next) => {
      router(req, res, next);
    });

    app.post('/parrot/scenario', (req, res) => {
      activeScenarioName = setActiveScenario(req.body.scenario);
      res.sendStatus(200);
    });

    app.get('/parrot/scenario', (req, res) => {
      res.json(activeScenarioName);
    });

    app.get('/parrot/scenarios', (req, res) => {
      res.json(scenarios);
    });

    registerMiddleware(app, { name: 'parrot-middleware' });
  };
}
