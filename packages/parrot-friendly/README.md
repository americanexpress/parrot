<h1 align="center">
	<img src="./parrot-friendly.png" alt="Parrot-Friendly" width="50%" />
</h1>

parrot-friendly is a helper library that allows you to write [scenarios](https://github.com/americanexpress/parrot/blob/main/SCENARIOS.md) using a more declarative syntax. Based on the behavior driven development (BDD) syntax of libraries such as [Jasmine](https://jasmine.github.io/) and [Mocha](https://mochajs.org/), parrot-friendly provides `describe`, `it`, and other methods to construct your scenarios object.

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
    get('/ship_log').status(500);
  });
});

export default scenarios;
```

## API

### `describe(description, scenarioDefinitions)`

Returns a scenarios object based on the `scenarioDefinitions` declared.

#### Arguments

- `description` (_String_): Scenarios object description. Currently this is not used internally but supported to provide a more common API.
- `scenarioDefinitions` (_Function_): Function that will define scenarios when invoked.

### `it(description, mockDefinitions)`

Adds a scenario with key `description` to the scenarios object.

#### Arugments

- `description` (_String_): Scenario description that will be used as a key to identify the scenario. Must be unique to a scenarios object.
- `mockDefinitions`: (_Function_): Function that will define mock objects when invoked.

### `mock(mockDefinition)`

Creates a mock for a HTTP request where `mockDefinition` is the entire mock object. This can be used in place of chaining methods such as `query` and `delay`, or to provide custom mock handling with a function.

#### Arguments

- `mockDefinition` (_Object_ or _Function_): Mock object with `request` and `response` keys or mock function.

### `request(requestDefinition)`

Creates a mock for a HTTP request where `requestDefinition` is the entire request object. Can be used in place of chaining request methods such as `query` or to provide a custom matching function.

#### Arguments

- `requestDefinition` (_Object_ or _Function_): Request object to be matched against or request function returning true for a match and false for a miss.

### `METHOD(path)`

Creates a mock for a HTTP request where METHOD is one of `get`, `head`, `post`, `put`, `del`, `connect`, `options`, `patch`.

`del` is used in place of `delete` as `delete` is a JavaScript reserved word.

#### Arguments

- `path` (_String_): Path matcher string. May include route params.

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

### `graphql(path, schema, mocks)`

Creates a mock for your GraphQL endpoint.

#### Arguments

- `path` (_String_): Path of your GraphQL endpoint.
- `schema` (_String_): GraphQL schema string.
- `mocks` (_Object_): Object describing your [mocking logic](https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks) that is passed to [graphql-tools](https://github.com/apollographql/graphql-tools) `mockServer`.
