<h1 align="center">
	<img src="./parrot-graphql.png" alt="Parrot-GraphQL" width="50%" />
</h1>

parrot-graphql is a helper library that resolves GET and POST requests to your GraphQL endpoint using mocking logic that is defined for each schema type. Under the hood, parrot-graphql is a small wrapper around [@graphql-tools/mock](https://github.com/apollographql/graphql-tools) `mockServer`.

For in-depth examples on how to write mock resolvers, read the above documentation from graphql-tools, but below is a simple example to start you on your way.

## Example

```js
// scenarios.js
const graphql = require('parrot-graphql');
const casual = require('casual'); // A nice mocking tool

const schema = `
type Query {
  shiplog: [ShipLog]
}

type ShipLog {
  Name: String!
  Captain: String!
}
`;

const scenarios = {
  'has a ship log from GraphQL': [
    graphql('/graphql', schema, {
      Name: () => 'Jolly Roger',
      Captain: () => casual.name,
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
