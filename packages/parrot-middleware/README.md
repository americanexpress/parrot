# parrot-middleware

## What's `parrot-middleware` for?

This express middleware allows developers to quickly and easily mock different API scenarios for local component development using both locally developed and commonly shared JSON objects.

Developers create a scenarios object that defines a set of configs for returning mock responses when a specific HTTP request is made.

## How do I use it?

Import the default `createMiddlewareForScenario` function from `parrot-middleware` and apply it to your local development Express app along with a config object containing your scenarios object.

```js
// Set up your express app
import express from 'express';
const app = express();

// Import the mock middleware
import createMiddlewareForScenario from 'parrot-middleware';

// Scenarios are a plain JS object that can be defined inside this file or imported
import myScenarios from './mock';

// The function takes a config object with a scenarios property
createMiddlewareForScenario({ scenarios: myScenarios })(app);
```

## Example Scenarios Object

```js
export default {
  zeroOffers: [{
    request: '/account-data/offers/v1/offers',
    response: {
      // Responses can be defined inline
      resource: {
        offers: [],
        counts: {
          eligible: 0,
          enrolled: 0
        }
      }
    },
    // Or read from a commonly shared JSON file
    {
      request: '/account-data/v1/member',
      response: require('axp-mock-offers/member/index.json')
    }
  }],
  multiOffers: [{
      // You can specify detailed request properties
      request: {
        path: '/account-data/offers/v1/offers',
        // Specify querystring parameters
        query: {
          status: 'ELIGIBLE'
        }
      },
      // and detailed responses
      response: {
        resource: require('./eligible.json'),
        // Set delays to test loading state
        delay: 1500
      }
    }, {
      // Handle responses for an individual request...
      request: '/account-data/offers/v1/offers/226381247',
      response: require('./details/error.json')
    }, {
      // ...and using route params
      request: '/account-data/offers/v1/offers/:id',
      response: ({ id }) => require(`./details/${id}`)
    }, {
      // Add handling for HTTP calls other than GET
      request: {
        path: '/account-data/offers/v1/offers/:id',
        method: 'PUT'
      },
      response: {
        resource: {
          code: 'EOS1000',
          message: 'Sorry! You are not eligible for this offer.'
        },
        statusCode: 400
      }
    }, {
      request: '/account-data/v1/member',
      response: require('axp-mock-member/member/index.json')
    }
  }]
};
```

## Scenarios Config API

The scenarios object is used to define all API responses to be handled by a UI component during local development. Although the responses can all be written at the top level of an object, one best practice that is recommended is to bundle responses together for easy swapping like in the example with `zeroOffers` and `multiOffers`.

### Request Options

| Property  | Description                              | Type   | Required |
| --------- | ---------------------------------------- | ------ | :------: |
| `path`    | Path matcher string. May include route params | String |  **Y**   |
| `query`   | Match against querystring key/value pairs | Object |    N     |
| `method`  | HTTP method defaults to GET, explicitly specify to handle others | String |    N     |
| `headers` | HTTP headers to match against            | Object |    N     |

### Response Options

| Property     | Description                              | Type                       | Required |
| ------------ | ---------------------------------------- | -------------------------- | :------: |
| `resource`   | Text to be returned directly or object to be returned as JSON or callback function with express `req` / `res` functions | String / Object / Function |  **Y**   |
| `delay`      | Set a response delay in ms               | Number                     |    N     |
| `statusCode` | Defaults to 200, but can be set explicitly | Number                     |    N     |

## Handling HTTP Methods

For most cases, our API scenarios will only need to handle HTTP GET. As a result, the default pattern for specifying a scenario is using a string to the endpoint and an object, which defines the GET response scenario.

If your UI depends on making other HTTP calls like PUT, DELETE, POST or PATCH, instead make an array of scenario objects, with the `method` property defined for each (if left undefined, it will default to GET).

```js
[{
  // This is a GET by default
  request: '/account-data/offers/v1/offers/25',
  resource: 'test/mocks/details/couponless.json',
}, {
  request: {
    path: '/account-data/offers/v1/offers/25',
    method: 'PUT'
  },
  response: {
    resource: 'test/mocks/details/addOfferError.json',
    statusCode: 400
  }
}]
```

## Accessing Express `req` & `res` Objects

### Using `req`

When dealing with a many responses (like offer details or transaction ETDs), it can be tedious to define each scenario. Express provides an interface for dealing with these dynamic scenarios by using **url parameters** (`req.params`). To help with this, `parrot-middleware` exposes the underlying express `req` object if the response resource is a functional callback. The express `req.params` object is provided to a callback and can be used to deteremine the mock resource. For example:

```js
{
  request: '/api/balance/:type/:id',
  response: ({ params: { type, id } }) => require(`./mock/balance/${type}/${id}`)
}
```

This setup means when your component hits the endpoint `/account-data/offers/v1/offers/25`, it will know to send the response from `test/mocks/details/25.json`

If the application tries to hit an endpoint with no defined response JSON, it will 404 and send an error alerting you that no scenario exists for that case.

### Using `res`

By default, if your resource is an object, `parrot-middleware` will send the response as JSON, and if it is a string it will just use `res.send` to respond. There are some cases where developers may want to use custom responses, and in this case we will provide the express `res` object as an argument to the functional resource callback.

```js
{
  request: '/wow',
  response: {
    resource: (req, res) => {
      const myImg = fs.readFileSync('./greatImage.png');
      res.sendFile(myImg);
    }
}
```

## Querystring Parameters

Often a single endpoint will be expected to provide different responses based on the querystring parameters passed to it.

When defining a scenario for an endpoint that works like this, treat each query string variation as a serparate request, explicitly specifying the query params in the `request` object. **Note that all values are strings.**

```js
  {
    request: {
      path: '/account-data/offers/v1/offers',
      query: {
        status: 'ELIGIBLE'
      }
    },
    response: 'test/mocks/eligible.json',
  }, {
    request: {
      path: '/account-data/offers/v1/offers',
      query: {
        status: 'ENROLLED'
      }
    },
    response: 'test/mocks/enrolled.json',
  },
```

In the current version, querystrings must be explicitly defined for all params (ex `?limit=1000&offset=0&status=posted`) would need this query object:
```js
{
    limit: '1000',
    offset: '0',
    status: 'posted'
}
```

## Contributing

The main purpose of this middleware is to make UI component development faster and easier, while handling most common API scenarios.

**No solution is perfect, and we welcome suggestions and contributions from the Amex Developer community. **

If you found a feature lacking or some part of this middleware was a bottleneck in your local development, please let us know - or even better, [fork it](https://stash.aexp.com/stash/users/jcros8/repos/axp-mock-middleware?fork) and make this project even better!

Please read our [contributing guidelines](CONTRIBUTING.md) for more information.
