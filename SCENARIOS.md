# Scenarios

Parrot scenarios describe combinations of data that you want to develop against. A scenario is comprised of multiple mocks that each describe how to match against an incoming request and what response to return.

## Examples

Below are some examples of how to configure your Parrot scenarios using different methods.
### Response as an object

```js
const scenarios = {
  'has a ship log': [
    {
      request: '/ship_log', // If request is a string, the HTTP method defaults to GET
      response: {
        body: require('./mocks/shipLog.json'),
        delay: 1200, // Optional, defaults to 0
        status: 200, // Optional, defaults to 200
      },
    },
  ],
};
```

### Response as a function

```js
const scenarios = {
  'has a ship log': [
    {
      request: '/ship_log',
      // Whatever is returned by this function will be put in the body of the response
      // Status will always be 200 for functions
      response: () => {
        return require('./mocks/shipLog.json');
      },
    },
  ],
};
```

## Functional Scenarios

```js
const scenarios = {
  'has one ship': [
    // Instead of an object with request/response, the function will
    // handle all requests. Use the `match` function to match routes.
    // Use this to set dynamic HTTP status codes.
    (req, match) => {
      if (match({ path: '/ship_log' })) {
        return {
          status: 200,
          body: require('./mocks/shipLog.json'),
          delay: 100,
        };
      }
      return {
        status: 404,
        body: { error: 'Resource Not Found' },
        delay: 100,
      };
    },
  ],
};
```

### GraphQL Example

```js
import graphql from 'parrot-graphql';
import schema from './schema'; // our GraphQL schema

const scenarios = {
  'has a ship log from GraphQL': [
    graphql('/graphql', schema, () => ({
      ShipLog: () => require('./mocks/shipLog.json'),
    })),
  ],
};
```

## Scenarios API

The options you can define on the `request` and `response` objects are described below.

### Request Options

| Property  | Description                                                  | Type   |
| --------- | ------------------------------------------------------------ | ------ |
| `path`    | Path matcher string. May include route params                | String |
| `query`   | Match against querystring key/value pairs                    | Object |
| `method`  | HTTP method defaults to GET, explicitly specify to handle others | String |
| `headers` | HTTP headers to match against                                | Object |

### Response Options

| Property | Description                                                  | Type                       |
| -------- | ------------------------------------------------------------ | -------------------------- |
| `body`   | Blob to be returned directly or object to be returned as JSON or function that resolve to a blob or object | String / Object / Function |
| `delay`  | Set a response delay in milliseconds                         | Number                     |
| `status` | Defaults to 200, but can be set explicitly                   | Number                     |

## Request, Response, and Mock Functions

In addition to defining `request`, `response` and `mock` as objects, they can also be defined as functions.

### `request(req, match)`

If `request` is a function, it will be run when determing if an incoming request matches the mock.  If a truthy value is returned the mock will match, if a falsy value is returned the mock will not match.

#### Arguments

* `req`: (*Object*): The normalized request object with `path`, `method`, `body`, `headers`, and `query` properties.
* `match`: (*Function*): Parrot's internal matching function that can be run against a request object.

### `response(req)`

If `response` is a function, it will be run once the request has matched and the response is being resolved.  The value that is returned from the function will be sent as the response.

#### Arguments

* `req`: (*Object*): The normalized request object with `path`, `method`, `body`, `headers`, `query`, and `params` properties.
* Additional implementation-specific arguments passed are the Express `req` and `res` objects for parrot-middleware and the `input` and `init` arguments to `fetch` for parrot-fetch.

### `mock(req, match)`

If the entire `mock` is a function, it will be called when determining if an incoming request matches the mock.  The value that is returned from the function will be sent as the response.

#### Arguments

- `req`: (*Object*): The normalized request object with `path`, `method`, `body`, `headers`, and `query` properties.
- `match`: (*Function*): Parrot's internal matching function that can be run against a request object.
- Additional implementation-specific arguments passed are the Express `req` and `res` objects for parrot-middleware and the `input` and `init` arguments to `fetch` for parrot-fetch.