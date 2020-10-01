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

import ParrotMiddleware from '../src/ParrotMiddleware';

jest.mock('parrot-core', () => class {});

describe('ParrotFetch', () => {
  it('should normalize', () => {
    const parrotFetch = new ParrotMiddleware();
    const normalized = parrotFetch.normalizeRequest({
      path: 'http://www.parrot.com/squawk?ahoy=matey',
    });
    expect(normalized).toMatchObject({
      path: 'http://www.parrot.com/squawk?ahoy=matey',
    });
  });

  it('should call next middleware', () => {
    const req = {};
    const res = { headersSent: false };
    const next = jest.fn();
    const parrotMiddleware = new ParrotMiddleware();
    parrotMiddleware.resolver(req, res, next)();
    expect(next).toHaveBeenCalled();
  });

  it('should not call next middleware if headers sent', () => {
    const req = {};
    const res = { headersSent: true };
    const next = jest.fn();
    const parrotMiddleware = new ParrotMiddleware();
    parrotMiddleware.resolver(req, res, next)();
    expect(next).not.toHaveBeenCalled();
  });

  it('should send json if response is an object', () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn() };
    const next = jest.fn();
    const response = { body: {} };
    const parrotMiddleware = new ParrotMiddleware();
    parrotMiddleware.resolver(req, res, next)(response);
    expect(res.json).toHaveBeenCalled();
  });

  it('should send status if there is no body', () => {
    const req = {};
    const res = { sendStatus: jest.fn(), status: jest.fn() };
    const next = jest.fn();
    const response = { status: 200 };
    const parrotMiddleware = new ParrotMiddleware();
    parrotMiddleware.resolver(req, res, next)(response);
    expect(res.sendStatus).toHaveBeenCalled();
  });

  it('should send body', () => {
    const req = {};
    const res = { send: jest.fn(), status: jest.fn() };
    const next = jest.fn();
    const response = { body: 'squawk' };
    const parrotMiddleware = new ParrotMiddleware();
    parrotMiddleware.resolver(req, res, next)(response);
    expect(res.send).toHaveBeenCalled();
  });

  it('should send body with type', () => {
    const req = {};
    const res = { send: jest.fn(), status: jest.fn(), type: jest.fn() };
    const next = jest.fn();
    const response = { body: '<!DOCTYPE html>', contentType: 'html' };
    const parrotMiddleware = new ParrotMiddleware();
    parrotMiddleware.resolver(req, res, next)(response);
    expect(res.type).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });
});
