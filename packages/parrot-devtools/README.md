# axp-mock-middleware

This webpack middleware allows developers to quickly and easily mock different API scenarios for local component development using both locally developed and commonly shared JSON objects.

## Background

Referencing the webpack API docs, there is a **devServer.setup** property available in your webpack config object that allows you to "*access the Express app object and add your own custom middleware to it.*"

This middleware allows developers to create a scenarios object that defines what *(mock)* responses are expected when different endpoints are called via an HTTP request.

## Example

```js
// This file will live in your local UI component repo
const scenarios = {
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
      response: `${AXP_API_MOCKS_PATH}/member/index.json`
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
        resource: 'test/mocks/eligible.json',
        // Set delays to test loading state
        delay: 1500
      }
    }, {
      // Handle responses for an individual request...
      request: '/account-data/offers/v1/offers/226381247',
      response: 'test/mocks/details/error.json'
    }, {
      // ...and using route params
      request: '/account-data/offers/v1/offers/:id',
      response: 'test/mocks/details/:id'
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
      response: `${AXP_API_MOCKS_PATH}/member/index.json`
    }
  }]
};
```

## Setup

In your `webpack.config.js` file, import the middleware and (optionally) the common api mocks path, then set up axp-mock-middleware as your webpack devServer.

```js
var webpack = require('webpack');
// Import the mock middleware
var createMiddlewareForScenario = require('axp-mock-middleware');
// Optionally import the API mocks path if you want to use common response objects
var AXP_API_MOCKS_PATH = require('axp-api-mocks').AXP_API_MOCKS_PATH;
// Scenarios are a plain JS object that can be defined inside this file or imported
var scenarios = require('./test/scenarios');
...
// Your webpack config export
module.exports = {
  ...
  // Add this object to your webpack config export
  devServer: {
    // 
    setup: function(app) {
      // One or both can be applied depending on what your component needs
      createMiddlewareForScenario(scenarios)(app);
      createMiddlewareForLanguage()(app);
    },
    // If you are using the HTML5 history API you probably need to serve your index.html in place of 404 responses (often used with react-router)
    historyApiFallback: true
  },
  ...
}
```

## Scenarios

The scenarios object is used to define all API responses to be handled by a UI component during local development. Although the responses can all be written at the top level of an object, one best practice that is recommended is to bundle responses together for easy swapping like in the example with `zeroOffers` and `multiOffers`.

### Request Options

| Property  | Description                              | Type   | Required |
| --------- | ---------------------------------------- | ------ | :------: |
| `path`    | Path matcher string. May include route params | String |  **Y**   |
| `query`   | Match against querystring key/value pairs | Object |    N     |
| `method`  | HTTP method defaults to GET, explicitly specify to handle others | String |    N     |
| `headers` | HTTP headers to match against            | Object |    N     |

### Response Options

| Property     | Description                              | Type            | Required |
| ------------ | ---------------------------------------- | --------------- | :------: |
| `resource`   | Path to response JSON, node module of response JSON, or inline response object | String / Object |  **Y**   |
| `extends`    | Modifications to be deepmerged into the original source file | String / Object |    N     |
| `delay`      | Set a response delay in ms               | Number          |    N     |
| `statusCode` | Defaults to 200, but can be set explicitly | Number          |    N     |

## Speed up local development with local resources and extends

### Shared Data Stores are great!

There are many advantages to using commonly shared data objects. Having distributed teams can lead to stale data or missed changes. Drawing from a community maintained datasource allows for these objects to be kept up to date by a larger group of developers. 

For this reason, we have created the `axp-api-mocks` repository as a source of common data. Although it is not a required dependency for `axp-mock-middleware`, we do recommend using it whenever possible as a best practice (and please [contribute back](https://stash.aexp.com/stash/users/jcros8/repos/axp-api-mocks?fork) if you develop new scenarios you think might be helpful for the rest of the community!)

### …but don't let them constrain your development

However, for local development there are cases when tying only to a common data store can be constraining. For this reason we have developed the ability to provide either a local or `/node-modules` based path for your mock files.



#### 

#### Extends

This property allows you to take a common data store and modify a few of the fields to better fit your use case. For example, maybe you want to use the single corporate card member scenario from `axp-api-mocks` but for a certain feature you're working on, you need to test it with a cancelled member.

Using the `extends` property, this is as simple as:

```js
{
  request: '/account-data/v1/member',
  response: {
    extends: `${AXP_API_MOCKS_PATH}/member/singleCorp.json`,
    resource: {
      accounts: [
        {
          "status": {
            "card_status": [
              "Canceled"
            ],
            "account_status": [
              "Canceled"
            ]
          }
        }
      ]
    }
  }
}
```

Now you'll get 90% of the common data with your small changes for development added in instantly. That was easy!

If you find yourself making larger modifications to the original object, consider turning it into a new file and contributing it back to `axp-api-mocks`. 

#### Local responses

Sometimes you might be working on a component with an API endpoint that isn't really relevant to other components (usefulLinks, referral, etc). In this case, the common data store won't have data to help you out. You could make pull requests to `axp-api-mocks` and then do development, but this is a very constraining workflow.

Rather, you can just define your .json responses locally, and set your resource path to point to your responses from the project root.

For example:

```js
{ 
  request: '/account-data/referrals/v1/referrals/',
  response: 'test/mocks/multiReferral.json'
}
```

In this way, while developing your UI component, you can quickly iterate on the data responses without having to worry about the git workflow. 

Later on, if you think your work might be helpful for other components, maybe make a pull request and add it into `axp-api-mocks`.

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

## Using URL Params

When dealing with a many responses (like offer details or transaction ETDs), it can be tedious to define each scenario. To help with this, `axp-mock-middleware` uses the url param syntax to allow for automated scenario matching. For example:

```js
{
  request: '/account-data/offers/v1/offers/:id',
  response: 'test/mocks/details/:id'
}
```

This setup means when your component hits the endpoint `/account-data/offers/v1/offers/25`, it will know to send the response from `test/mocks/details/25.json` 

If the application tries to hit an endpoint with no defined response JSON, it will 404 and send an error alerting you that no scenario exists for that case.

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


## Local Component Development

The ability to select scenarios, products, and locales has been abstraced into ```<ParrotCage />``` . They are connected to the locally created store, allowing full access to all actions and state. In fact, changing a product or locale with the supplied dropdown dispatches the appropriate actions from ```axp-api-ducks``` and ```axp-global-ducks``` respectively.

![ScenarioSelector, ProductSelector, LocaleSelector](ParrotCageOptions.png)

#### Props

| Prop                   | Type    | Description                              | Required |
| ---------------------- | ------- | ---------------------------------------- | -------- |
| ```store```            | object  | A redux store composed of reducers from ```axp-api-ducks``` plus any reducers being developed. | **Y**    |
| ```component```        | element | The container component being developed. | **Y**    |
| ```scenarios```        | object  | The mocked [scenarios](#scenarios) to be used | **Y**    |
| ```locale```           | string  | The default locale to be set             | N        |
| ```onScenarioChange``` | func    | Will run after the scenario has been changed | N        |
| ```onProductChange```  | func    | Will run after the product has been changed | N        |
| ```componentKey```     | string  | The snakecase key to be used with ```<IntlProvider />``` ex: 'axpUsefulLinks' | **Y**    |

Additionally, setting up your initial store has been abstracted to `createMockStore()`.  By default, this will create the store using the reducers defined in `axp-api-ducks` but can be optionally passed a parameter that contains the custom reducers for the components you are developing.  This parameter will be passed to combineReducers so should be passed as an object or array of objects with the keys you expect to be used in the store: `createMockStore({ axpUsefulLinks: usefulLinks })`.

#### Example index.dev.js

```javascript
import React from 'react';
import { render } from 'react-dom';
import UsefulLinks from './src/components/UsefulLinks.jsx';
import ParrotCage from 'axp-mock-middleware/lib/components';
import createMockStore from 'axp-mock-middleware/lib/createMockStore';
import scenarios from './test/scenarios';

render(
  <ParrotCage
      store={createMockStore()}
      component={UsefulLinks}
      componentKey='axpUsefulLinks'
      scenarios={scenarios}
  >
    <UsefulLinks />
  </ParrotCage>,
  document.getElementById('root');
);
```



## Contributing

The main purpose of this middleware is to make UI component development faster and easier, while handling most common API scenarios. 

**No solution is perfect, and we welcome suggestions and contributions from the Amex Developer community. **

If you found a feature lacking or some part of this middleware was a bottleneck in your local development, please let us know - or even better, [fork it](https://stash.aexp.com/stash/users/jcros8/repos/axp-mock-middleware?fork) and make this project even better!