import pathToRegexp from 'path-to-regexp';

export default function getParams(path, route) {
  const keys = [];
  const re = pathToRegexp(route, keys);
  const [, ...values] = re.exec(path);
  return keys.reduce(
    (acc, { name }, index) => ({
      ...acc,
      [name]: values[index],
    }),
    {}
  );
}
