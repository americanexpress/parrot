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
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ParrotMiddleware from './ParrotMiddleware';

export default function parrot(scenarios) {
  const parrotMiddleware = new ParrotMiddleware(scenarios);

  const jsonParser = bodyParser.json();
  const parrotRouter = Router();

  parrotRouter.post('/parrot/scenario', (req, res) => {
    parrotMiddleware.setActiveScenario(req.body.scenario);
    res.sendStatus(200);
  });

  parrotRouter.get('/parrot/scenario', (req, res) => {
    res.json(parrotMiddleware.getActiveScenario());
  });

  parrotRouter.get('/parrot/scenarios', (req, res) => {
    res.json(parrotMiddleware.getScenarios());
  });

  return [jsonParser, cookieParser(), parrotRouter, parrotMiddleware.resolve];
}
