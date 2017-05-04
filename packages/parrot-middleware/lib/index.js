'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMiddlewareForScenario;

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _parrotRegistry = require('parrot-registry');

var _parrotRegistry2 = _interopRequireDefault(_parrotRegistry);

var _logging = require('./utils/logging');

var _logging2 = _interopRequireDefault(_logging);

var _validateRouteConfig = require('./validateRouteConfig');

var _validateRouteConfig2 = _interopRequireDefault(_validateRouteConfig);

var _normalizeRouteConfig = require('./normalizeRouteConfig');

var _normalizeRouteConfig2 = _interopRequireDefault(_normalizeRouteConfig);

var _createRoute = require('./createRoute');

var _createRoute2 = _interopRequireDefault(_createRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMiddlewareForScenario(_ref) {
  var scenarios = _ref.scenarios;

  return function (app) {
    var logger = new _logging2.default();
    var router = void 0;
    function createRoutesForScenario(scenario, routeValidator) {
      router = (0, _express.Router)();
      scenario.forEach(function (config) {
        try {
          (0, _validateRouteConfig2.default)(config);
          (0, _createRoute2.default)(router, (0, _normalizeRouteConfig2.default)(config), routeValidator, logger);
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

    var activeScenarioName = setActiveScenario(Object.keys(scenarios)[0]);

    app.use(_bodyParser2.default.json());
    app.use(function (req, res, next) {
      router(req, res, next);
    });

    app.post('/parrot/scenario', function (req, res) {
      activeScenarioName = setActiveScenario(req.body.scenario);
      res.sendStatus(200);
    });

    app.get('/parrot/scenario', function (req, res) {
      res.json(activeScenarioName);
    });

    app.get('/parrot/scenarios', function (req, res) {
      res.json(scenarios);
    });

    (0, _parrotRegistry2.default)(app, { name: 'parrot-middleware' });
  };
} /* eslint-disable no-param-reassign */