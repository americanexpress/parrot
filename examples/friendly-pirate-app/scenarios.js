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

const {
  describe, it, get,
} = require('parrot-friendly');

const scenarios = describe('Scenarios (parrot-friendly)', () => {
  it('has one friendly ship', () => {
    get('/ship_log').response([{ name: 'The Jolly Roger', captain: 'Captain Hook' }]);
  });

  it('has more friendly ships', () => {
    get('/ship_log').response([
      { name: 'The Jolly Roger', captain: 'Captain Hook' },
      { name: 'The Black Pearl', captain: 'Jack Sparrow' },
      { name: 'Flying Dutchman', captain: 'Davy Jones' },
      { name: 'The Wanderer', captain: 'Captain Ron' },
    ]);
  });

  it('has a partial success and an error', () => {
    get('/ship_log').data([
      { name: 'The Jolly Roger', captain: 'Captain Hook' },
      { name: 'The Black Pearl', captain: 'Jack Sparrow' },
      { name: 'The Wanderer', captain: 'Captain Ron' },
    ]).errors([
      { message: "We're missing Davey Jones!" }
    ]);
  });

  it('has a partial success and multiple errors', () => {
    get('/ship_log').data([
      { name: 'The Jolly Roger', captain: 'Captain Hook' },
      { name: 'The Black Pearl', captain: 'Jack Sparrow' },
    ]).errors([
      { message: "We're missing Davey Jones!" },
      { message: "We're missing Captain Ron!" }
    ]);
  });

  it('has a server error', () => {
    get('/ship_log').status(500);
  });
});

module.exports = scenarios;
