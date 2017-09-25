import getParams from './utils/getParams';

export default function resolveResponse(
  req,
  res,
  { request: { path }, response: { resource, statusCode, delay } }
) {
  let response = resource;

  if (path) {
    req.params = getParams(req.path, path);
  }

  if (typeof resource === 'function') {
    if (resource.length === 2) {
      resource(req, res);
      return;
    }
    response = resource(req);
  }

  const sendMethod = typeof response === 'object' ? 'json' : 'send';
  res.status(statusCode);
  if (delay) {
    setTimeout(() => res[sendMethod](response), delay);
  } else {
    res[sendMethod](response);
  }
}
