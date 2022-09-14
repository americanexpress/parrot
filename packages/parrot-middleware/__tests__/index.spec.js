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
import ParrotMiddleware from '../src/ParrotMiddleware';
import parrotMiddleware from '../src';

jest.mock('express', () => {
  const req = { body: { scenario: 'squawk' } };
  const res = {
    sendStatus: jest.fn(),
    json: jest.fn(),
  };
  const post = jest.fn((path, cb) => cb(req, res));
  const get = jest.fn((path, cb) => cb(req, res));
  return {
    Router: () => ({ post, get, res }),
  };
});
jest.mock('body-parser', () => ({ json: jest.fn() }));
jest.mock(
  '../src/ParrotMiddleware',
  () =>
    class Mock {
      static getActiveScenario = jest.fn();

      static setActiveScenario = jest.fn();

      static getScenarios = jest.fn();

      getActiveScenario = Mock.getActiveScenario;

      setActiveScenario = Mock.setActiveScenario;

      getScenarios = Mock.getScenarios;
    }
);

describe('parrot-middleware', () => {
  it('should set up the middleware', () => {
    const middleware = parrotMiddleware();
    const router = Router();

    expect(bodyParser.json).toHaveBeenCalled();
    expect(router.post).toHaveBeenCalled();
    expect(router.get).toHaveBeenCalled();
    expect(router.res.sendStatus).toHaveBeenCalled();
    expect(router.res.json).toHaveBeenCalled();
    expect(ParrotMiddleware.getActiveScenario).toHaveBeenCalled();
    expect(ParrotMiddleware.setActiveScenario).toHaveBeenCalled();
    expect(ParrotMiddleware.getScenarios).toHaveBeenCalled();
    expect(middleware).toEqual(expect.any(Array));
  });
});
