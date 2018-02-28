# parrot-fetch

parrot-fetch is an implementation of Parrot that mocks the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Example

```js
import parrotFetch from 'parrot-fetch';
import scenarios from './scenarios';

// fetch will be mocked once the parrotFetch function is called
const parrot = parrotFetch(scenarios);

// set the scenario to be used
parrot.setActiveScenario('has a ship log');
```