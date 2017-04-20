# parrot-listener

An express middleware that intercepts request/responses and creates a parrot-compatible scenario.

## Options

* `output` (String) - Output directory
* `matcher` (Function) - Takes in request object to determine which responses to include in the scenario
* `name` (String) - Name of the written scenario
* `listening` (Boolean) - Whether to start in listening mode
* `parser` (Function) - Optional function to preparse the request object before writing it in the scenario file
* `logger` (Function) - Optional function to log to an interface other than `console.log`

## Usage

### Basic Example

```js
import ParrotListener from 'parrot-listener';

export default (app) => {
  const listener = new ParrotListener({
    output: './mocks/generated/',
    matcher: (req) => req.path.match(/api/),
    parser: (req) => ({
      path: req.path,
      params: req.params,
      query: req.query,
    }),
    name: 'TwoUsers',
    listening: true,
  });
  listener(app);
};
```

### Controlling via API

parrot-listener sets up 2 endpoints to control the listener state:

* PUT `/parrot/listen` - Able to turn on/off the listener, pass the following in the body
  * `action` (String): One of type: 'START', 'STOP'
  * `name` (String): Required if starting, used as scenario name
* GET `/parrot/listen` - Returns boolean of if listener is running

### Controlling with the Command Line

The parrot-listener middleware also exports a [yargs](http://npmjs.com/package/yargs) configuration to allow for choosing initializing options for the listener from the command line.

#### Options

* `-l`, `—listen` (Boolean) - Initialize with listener on, listening to incoming requests from server startup
* —name (String) - Name for the scenario, required if `—listen` flag is passed

#### Setup

```javascript
import ParrotListener, { setupCmdArgs } from 'parrot-listener';
import yargs, { argv } from 'yargs';

setupCmdArgs(yargs);

export default (app) => {
  if (argv.l) {
    if (!argv.name) {
      console.warn('Invalid Arguments! You must provide a scenario name when using Parrot\'s --listen mode.');
    } else {
      const listener = new ParrotListener({
        output: './mocks/generated/',
        matcher: (req) => req.path.match(/api/),
        parser: (req) => ({
          path: req.path,
          params: req.params,
          query: req.query,
        }),
        name: argv.name,
        listening: argv.listen,
      });
      listener(app);
    }
  }
};
```



