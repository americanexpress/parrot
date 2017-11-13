import getParams from './utils/getParams';

export default function resolveResponse(
  req,
  res,
  { request: { path }, response: { resource, statusCode, delay } },
  resolver
) {
  let response = resource;

  if (path) {
    req.params = getParams(req.path, path);
  }

  if (typeof resource === 'function') {
    if (resource.length === 2) {
      resource(req, res);
      return null;
    }
    response = resource(req);
  }

  return resolver(response, statusCode, delay);
}
