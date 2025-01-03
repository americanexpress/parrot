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

import Parrot from 'parrot-core';

class ParrotMiddleware extends Parrot {
  normalizeRequest = req => req;

  resolver = (req, res, next) => response => {
    if (res.headersSent) {
      return;
    }
    if (!response) {
      this.logger.warn('No matching mock found for request', req.path);
      next();
      return;
    }

    const { body, contentType, status } = response;
    res.status(status);

    if (contentType) {
      res.type(contentType);
    }

    if (typeof body === 'object') {
      res.json(body);
    } else if (typeof body === 'undefined') {
      res.sendStatus(status);
    } else {
      res.send(body);
    }
  };

  getActiveScenarioOverride = req => (req.cookies ? req.cookies.parrotScenarioOverride : undefined);
}

export default ParrotMiddleware;
