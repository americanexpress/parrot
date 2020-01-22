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

module.exports.httpScenarios = {
  'has one ship': [
    {
      request: '/ship_log',
      response: {
        body: [{ name: 'The Jolly Roger', captain: 'Captain Hook' }],
      },
    },
  ],
  'has more ships': [
    {
      request: '/ship_log',
      response: {
        body: [
          { name: 'The Jolly Roger', captain: 'Captain Hook' },
          { name: 'The Black Pearl', captain: 'Jack Sparrow' },
          { name: 'Flying Dutchman', captain: 'Davy Jones' },
          { name: 'The Wanderer', captain: 'Captain Ron' },
        ],
      },
    },
  ],
  'has a server error': [
    {
      request: '/ship_log',
      response: {
        status: 500,
      },
    },
  ],
};

console.log(JSON.stringify(process.memoryUsage(), null, 2))

module.exports.wsScenarios = {
  'pirate chat': [
    // {
    //   request: '/pirate-chat',
    //   events: {
    //     connection: { connectionId: '1234' },
    //     messages: [
    //       {
    //         user: 'Captain A',
    //         message: 'Arr! How ya be, matties?',
    //       },
    //       {
    //         user: 'Captain A',
    //         message: 'I been shiver\'n me timbers',
    //       },
    //       {
    //         user: 'Captain Jack Sparrow',
    //         message: 'kimma commander is float',
    //       },
    //       {
    //         user: 'Captain B',
    //         message: 'Arr! How ya be, matties?',
    //       },
    //     ],
    //     interval: 2000,
    //   },
    // },
    {
      request: '/pirate-chat',
      events: {
        connection: { connectionId: '1234' },
        message: (ws, request) => {
          ws.send('Yo buddy');
        },
      },
    },
  ],
};
