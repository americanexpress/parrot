const registerMiddleware = (app, opts = {}) => {
  if (!app || !app.locals) {
    throw Error('Invalid express app instance passed to parrot registry');
  }
  if (!app.locals.parrot) {
    app.locals.parrot = {}; // eslint-disable-line no-param-reassign
  }
  if (!app.locals.parrot.registry) {
    app.locals.parrot.registry = []; // eslint-disable-line no-param-reassign
  }
  if (!opts.name) {
    throw Error('You must pass a middleware name in the parrot registry options');
  }
  app.locals.parrot.registry.push(opts.name);

  app.get('/parrot/registry', (req, res) => {
    res.json({
      middlewares: app.locals.parrot.registry,
    });
  });
};

module.exports = registerMiddleware;
