# parrot-middleware

parrot-middleware is an implementation of Parrot that can be used as an [Express](http://expressjs.com/) middleware.

Given a collection of Parrot scenarios which each have a list of request and response pairs, the parrot middleware will intercept the `request`s that match the paths in the active scenario. The middleware will also expose 3 additional routes which are detailed below: `GET /parrot/scenario`, `POST /parrot/scenario`, `GET /parrot/scenarios`.

## Example

Let's walk through how to set up some scenarios using the parrot-middleware.

### Define your scenarios

Add a file to the root of your project called [`scenarios.js`](/americanexpress/parrot/blob/main/SCENARIOS.md):

```js
// scenarios.js
const scenarios = {
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
  'has more ships with any mime type': [
    {
      request: '/ship_log',
      response: {
        contentType: 'text/plain',
        body: [
          '# Ship Log',
          "* name: 'The Jolly Roger', captain: 'Captain Hook'",
          "* name: 'The Black Pearl', captain: 'Jack Sparrow'",
        ].join('\n'),
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

export default scenarios;
```

This file has three scenarios: `has one ship`, `has more ships`, and `has a server error`. Each scenario is mocking a single request: `/ship_log`. This means that depending on which scenario is active, hitting `/ship_log` will return different responses.

### Providing the middleware

Now let's create a tiny web server. Add a file named `server.js` to the root of your project. Make sure that you `npm install express parrot-middleware` before running `server.js`:

```js
// server.js
import express from 'express';
import parrot from 'parrot-middleware';
import scenarios from './scenarios';

const app = express();

app.use(parrot(scenarios));

app.listen(3001);
```

### Setting the active scenario

Let's get our server running. Run `node server.js` from the command line, which will spin up our tiny web server on `http://localhost:3001`.

Now that our server is running, we can set the active scenario by sending a POST request to `http://localhost:3001/parrot/scenario` with a JSON payload that contains a single key/value pair `"scenario": "<scenario name>"`. Let's activate one of our scenarios:

```

POST http://localhost:3001/parrot/scenario
Content-Type: application/json

{
  "scenario": "has one ship"
}

```

We can verify that the active scenario is now `has one ship` by simply submitting a GET request to the same URL: http://localhost:3001/parrot/scenario.

Now that `"has one ship"` is the active scenario, navigating to http://localhost:3001/ship_log will return `[{ name: 'The Jolly Roger', captain: 'Captain Hook' }]`.

Try setting the active scenario to `has more ships` and see if you get the expected response in our scenarios!

### Inspect scenarios

If you'd like to see exactly how the scenarios are parsed and view more details as to what the expected response will be, you can send a GET request to http://localhost:3001/parrot/scenarios, which for us would return:

```js
[
  {
    name: 'has one ship',
    mocks: [
      {
        request: {
          path: '/ship_log',
          method: 'GET',
        },
        response: {
          status: 200,
          body: [
            {
              name: 'The Jolly Roger',
              captain: 'Captain Hook',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'has more ships',
    mocks: [
      {
        request: {
          path: '/ship_log',
          method: 'GET',
        },
        response: {
          status: 200,
          body: [
            {
              name: 'The Jolly Roger',
              captain: 'Captain Hook',
            },
            {
              name: 'The Black Pearl',
              captain: 'Jack Sparrow',
            },
            {
              name: 'Flying Dutchman',
              captain: 'Davy Jones',
            },
            {
              name: 'The Wanderer',
              captain: 'Captain Ron',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'has a server error',
    mocks: [
      {
        request: {
          path: '/ship_log',
          method: 'GET',
        },
        response: {
          status: 500,
        },
      },
    ],
  },
];
```

## Using Scenarios

For ease of use, you may want to check out [the Parrot Devtool Chrome Plugin](https://chrome.google.com/webstore/detail/parrot-devtools/jckchajdleibnohnphddbiglgpjpbffn), which will provide an easy to use interface for interacting with the endpoints above.
