/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import { Router } from 'express';
import enableWs from 'express-ws';
import bodyParser from 'body-parser';
import ParrotWebSocket from './ParrotWebSocket';
import { normalizeScenarios, resolveResponse } from './utils';

export default function parrot(app, scenarios) {
  const parrotWebSocket = new ParrotWebSocket(scenarios, {
    normalizeScenarios,
    resolveResponse,
  });

  const jsonParser = bodyParser.json();
  const parrotRouter = Router();

  enableWs(app);

  parrotRouter.post('/parrot/ws/scenario', (req, res) => {
    parrotWebSocket.setActiveScenario(req.body.scenario);
    res.sendStatus(200);
  });

  parrotRouter.get('/parrot/ws/scenario', (req, res) => {
    res.json(parrotWebSocket.getActiveScenario());
  });

  parrotRouter.get('/parrot/ws/scenarios', (req, res) => {
    res.json(parrotWebSocket.getScenarios());
  });

  return [jsonParser, parrotRouter, parrotWebSocket.resolve];
}
