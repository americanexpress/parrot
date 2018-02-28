# parrot-core

parrot-core abstracts the matching, logging, and resolving functionality of Parrot away from each implementation.  [parrot-middleware](https://github.com/americanexpress/parrot/blob/master/packages/parrot-middleware) and [parrot-fetch](https://github.com/americanexpress/parrot/blob/master/packages/parrot-fetch) use parrot-core and any new implementations could extend parrot-core in a similar way.

## Example Implementation

```js
import Parrot from 'parrot-core';

class ParrotNew extends Parrot {
  constructor(scenarios) {
    super(scenarios);
    // any constructor logic that is needed
  }

  normalizeRequest = (request) => {
    // conform incoming requests to match the scenarios structure
  }

  resolver = (request) => (response) => {
    // resolve the matched response to the implementation platform
  }
}

export default ParrotNew;
```

## Access Methods

parrot-core also defines several methods that can be used to interact with the scenarios that are passed in.

### `getActiveScenario()`

Returns the name of the currently active scenario.

### `setActiveScenario(name)`

Sets the currently active scenario.

#### Arguments

* `name` (_String_): Scenario name.

### `getScenarios()`

Returns an array of scenario objects.

### `setScenarios(scenarios)`

Sets `scenarios` as the array of available scenarios.

#### Arguments

* `scenarios` (*Array* or *Object*): Scenarios descriptor.

### `getScenario(name)`

Returns the scenario object with matching `name`.

#### Arguments

* `name` (*String*): Scenario name.

### `setScenario(name, mocks)`

Sets the mocks for scenario with matching `name`.

#### Arguments

* `name` (*String*): Scenario name.
* `mocks` (*Array*): Array of mock objects.

### `getMock(name, index)`

Returns the mock at `index` for scenario with matching `name`.

#### Arguments

* `name` (*String*): Scenario name.
* `index` (*Number*): Mock index.

### `setMock(name, index, mock)`

Sets the mock at `index` for scenario with matching `name`.

#### Arguments

* `name` (*String*): Scenario name.
* `index` (*Number*): Mock index.
* `mock` (*Object*): Mock object.

