# Parrot

Parrot allows developers to quickly and easily mock different API scenarios during local web development using both self-contained and commonly shared JSON objects.

## Getting Started

To get started, we recommend using [`parrot-friendly`](https://stash.aexp.com/stash/projects/ONE/repos/parrot/browse/packages/parrot-friendly) to write your scenarios and [`parrot-middleware`](https://stash.aexp.com/stash/projects/ONE/repos/parrot/browse/packages/parrot-middleware) to add the scenarios to your app.  An example configuration using these packages is below:

```js
import { describe, it, get } from 'parrot-friendly';
import createMiddleware from 'parrot-middleware';

const scenarios = describe('Ship Log', () => {
  it('should display the ship log', () => {
    get('/ship_log')
      .response(require('./mocks/shipLog.json'))
      .delay(1200);
  });

  it('should show an error', () => {
    get('/ship_log')
      .response(require('./mocks/error.json'))
      .status(500);
  });
});

// import this function wherever your app is available
export default app => createMiddleware({ scenarios })(app);
```

