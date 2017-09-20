const logValidation = (routeValidation, outputFn) => {
  let errors = [];
  if (routeValidation.errors) {
    errors = Array.isArray(routeValidation.errors)
      ? routeValidation.errors
      : [routeValidation.errors];
  }
  outputFn(`The route validation found ${errors.length} error(s).`);
  errors.forEach(err => outputFn(err.message));
};

export default logValidation;
