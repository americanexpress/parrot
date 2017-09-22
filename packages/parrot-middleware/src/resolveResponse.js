import getParams from './utils/getParams';

export default function resolveResponse(req, res, mock) {
  const { resource, statusCode, delay } = mock.response;
  let response = resource;

  if (mock.request.path) {
    req.params = getParams(req.path, mock.request.path);
  }

  if (typeof resource === 'function') {
    if (resource.length === 2) {
      resource(req, res);
    } else {
      response = resource(req);
    }
  }

  res.status(statusCode);
  const method = typeof response === 'object' ? 'json' : 'send';

  if (delay) {
    setTimeout(() => {
      res[method](response);
    }, mock.response.delay);
  } else {
    res[method](response);
  }
}
