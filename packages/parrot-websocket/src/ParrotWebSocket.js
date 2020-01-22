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

class ParrotWebSocket extends Parrot {
  normalizeRequest = req => {
    return {
      ...req,
      path: req.path.replace('/.websocket', ''),
    };
  };

  resolveMessage = ws => (message, request) => {
    if (typeof message === 'function') {
      message(ws, request);
    } else {
      ws.send(JSON.stringify(message));
    }
  };

  resolver = req => events => {
    const { connection, messages, interval, message } = events;

    const messageResolver = this.resolveMessage(req.ws);

    if (connection) {
      messageResolver(connection);
    }

    if (message) {
      req.ws.on('message', request => {
        messageResolver(message, request);
      });
    }

    if (messages) {
      messages.forEach((msg, i) => {
        setTimeout(() => messageResolver(messages[i]), interval * (i + 1));
      });
    }
  };
}

export default ParrotWebSocket;
