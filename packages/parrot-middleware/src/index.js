/* eslint-disable no-param-reassign */
import { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import LogCreator from './utils/logging';
import validateRouteConfig from './validateRouteConfig';
import normalizeRouteConfig from './normalizeRouteConfig';
import createRoute from './createRoute';

export default function createMiddlewareForScenario({ scenarios, validator }) {
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
      createRoutesForScenario(scenarios[scenarioName], validator);
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
