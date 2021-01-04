<h1 align="center">
	<img src="./parrot-graphql.png" alt="Parrot-GraphQL" width="50%" />
</h1>

parrot-graphql is a helper library that resolves GET and POST requests to your GraphQL endpoint using mocking logic that is defined for each schema type. Under the hood, parrot-graphql is a small wrapper around [graphql-tools](https://github.com/apollographql/graphql-tools) `mockServer`. For more information about writing mock resolvers, check out Apollo's [helpful documentation](https://www.apollographql.com/docs/graphql-tools/mocking.html).

## Example

```js
const graphql = require('parrot-graphql');
const schema = require('./schema'); // our GraphQL schema

const scenarios = {
  'has a ship log from GraphQL': [
    graphql('/graphql', schema, {
      ShipLog: () => require('./mocks/shipLog.json'),
    }),
  ],
};

module.exports = scenarios;
```

## API

### `graphql(path, schema, mocks)`

Creates a function for your GraphQL endpoint.

#### Arguments

- `path` (_String_): Path of your GraphQL endpoint.
- `schema` (_String_): GraphQL schema string.
- `mocks` (_Object_): Object describing your [mocking logic](https://www.apollographql.com/docs/graphql-tools/mocking.html#Customizing-mocks) that is passed to [graphql-tools](https://github.com/apollographql/graphql-tools) `mockServer`.
