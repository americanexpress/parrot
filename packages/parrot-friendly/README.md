# parrot-friendly

`parrot-friendly` is a utility library that allows you to write your [Parrot scenarios](https://stash.aexp.com/stash/projects/ONE/repos/parrot/browse/packages/parrot-middleware#example-scenarios-object) using a more declarative syntax.  Based on the behavior driven development (BDD) syntax of libraries such as [Jasmine](https://jasmine.github.io/) and [Mocha](https://mochajs.org/), `parrot-friendly` provides `describe`, `it`, and other methods to construct your scenarios object.

## Example

```js
import { describe, it, get } from 'parrot-friendly';

const scenarios = describe('Ship Log', () => {
  it('should display the ship log', () => {
    get('/ship_log')
      .response(require('./mocks/shipLog.json'))
      .delay(1200);
  });

  it('should show an error', () => {
    get('/ship_log')
      .response(require('./mocks/error.json'))
      .status(500);
  });
});

export default scenarios;
```

## API

### `describe(description, scenarioDefinitions)`

Returns a scenarios object based on the `scenarioDefinitions` declared.

#### Arguments

* `description` (_String_): Scenarios object description.  Currently this is not used internally but supported to provide a more common API.
* `scenarioDefinitions` (_Function_): Function that will define scenarios when invoked.

### `it(description, mockDefinitions)`

#### Arugments

* `description` (_String_): Scenario description that will be used as a key to identify the scenario.  Must be unique to a scenarios object.
* `mockDefinitions`: (_Function_): Function that will define mock objects when invoked.

### `METHOD(path)`

Creates a mock for a HTTP request where METHOD is one of `get`, `head`, `post`, `put`, `del`, `connect`, `options`, `patch`.

`del` is used in place of `delete` as `delete` is a JavaScript reserved word.

#### Arguments

* `path` (_String_): Path matcher string. May include route params.

#### Methods

##### `.query(query)`

Matches against the `query` object provided.

##### `.headers(headers)`

Matches against the `headers` object provided

##### `.response(resource)`

Responds with the `resource` provided.

##### `.delay(amount)`

Delays the response for `amount` of milliseconds.

##### `.status(code)`

Responds with a `code` status code.

