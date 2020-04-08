<h1 align="center">
	<img src="./parrot-fetch.png" alt="Parrot-Fetch" width="50%" />
</h1>

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

## Mocking a non-global fetch example

```js
import parrotFetch from 'parrot-fetch';
import scenarios from './scenarios';

// include a fetchClient inside of a fetchWrapper object and pass it into the parrotFetch function to mock the fetchClient

const fetchWrapper = {
  fetchClient,
};
const parrot = parrotFetch(scenarios, fetchWrapper);

// set the scenario to be used
parrot.setActiveScenario('has a ship log');
```
### Mocking a non-global fetch - use case example

An example use case for mocking a non-global fetch could be mocking a fetchClient that is passed in as an extra thunk argument using [redux-thunk withExtraArgument](https://github.com/reduxjs/redux-thunk). Mocking this redux thunk fetchClient would look something like below:

```js
import parrotFetch from 'parrot-fetch';
import scenarios from './scenarios';

const callParrotFetch = () => {
  return (dispatch, getState, fetchWrapper) => {
    // fetchWrapper = { fetchClient };
    return parrotFetch(scenarios, fetchWrapper);
  };
};
const parrot = dispatch(callParrotFetch());
parrot.setActiveScenario('has a ship log');
```
