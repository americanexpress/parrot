# parrot-middleware

parrot-middleware is an implementation of Parrot that can be used as an [Express](http://expressjs.com/) middleware.

## Example

```js
import express from 'express';
import parrot from 'parrot-middleware';
import scenarios from './scenarios';

const app = express();

app.use(parrot(scenarios));

app.listen(3000);
```

Once the server is running, the following endpoints are exposed to interact with your scenarios:

### GET `/parrot/scenario`

Responds with the name of the currently active scenario.

### POST `/parrot/scenario`

Sets the currently active scenario.

### GET `/parrot/scenarios`

Responds with an array of scenario objects.