import bodyParser from 'body-parser';
import registerMiddleware from 'parrot-registry';
import logger from './utils/Logger';
import matchMock from './matchMock';
import validateScenarios from './validateScenarios';
import normalizeScenarios from './normalizeScenarios';
import resolveResponse from './resolveResponse';

export default function createMiddleware({ scenarios }) {
  validateScenarios(scenarios);
  const normalizedScenarios = normalizeScenarios(scenarios);
  let [activeScenarioName] = Object.keys(normalizedScenarios);
  logger.setScenario(activeScenarioName);

  return app => {
    app.use(bodyParser.json());

    app.all('*', (req, res, next) => {
      const mock = matchMock(req, res, normalizedScenarios[activeScenarioName]);

      if (!mock) {
        if (!res.headersSent) {
          next();
        }
        return;
      }

      resolveResponse(req, res, mock);
    });

    app.post('/parrot/scenario', (req, res) => {
      activeScenarioName = req.body.scenario;
      logger.setScenario(activeScenarioName);
      res.sendStatus(200);
    });

    app.get('/parrot/scenario', (req, res) => {
      res.json(activeScenarioName);
    });

    app.get('/parrot/scenarios', (req, res) => {
      res.json(normalizedScenarios);
    });

    registerMiddleware(app, { name: 'parrot-middleware' });
  };
}
