import pathToRegexp from 'path-to-regexp';

export default function getParams(path, route) {
  const keys = [];
  const [, ...values] = pathToRegexp(route, keys).exec(path);
  return keys.reduce(
    (acc, { name }, index) => ({
      ...acc,
      [name]: values[index],
    }),
    {}
  );
}
