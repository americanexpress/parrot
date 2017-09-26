import registerMiddleware from 'parrot-registry';
import validatorMiddleware from './validatorMiddleware';

const swaggerValidator = validatorConfig => {
  const middleware = validatorMiddleware(validatorConfig);
  return app => {
    app.use(middleware);
    registerMiddleware(app, { name: 'parrot-validator-swagger' });
  };
};

export default swaggerValidator;
