import util from 'util';
import isEqual from 'lodash/isEqual';
import pathToRegexp from 'path-to-regexp';
import logger from './utils/Logger';

function match(req) {
  return request =>
    Object.keys(request).every(property => {
      if (property === 'path') {
        return pathToRegexp(request.path).exec(req.path);
      } else if (property === 'headers') {
        return Object.keys(request.headers).every(key => request.headers[key] === req.headers[key]);
      }

      return isEqual(req[property], request[property]);
    });
}

export default function matchMock(req, res, mocks) {
  let matchedMock;
  for (let index = 0; index < mocks.length; index += 1) {
    const mock = mocks[index];
    if (typeof mock === 'function') {
      mock(req, res, match(req));
      if (res.headersSent) {
        logger.info('Matched mock function.', req.path);
        break;
      }
    } else if (typeof mock.request === 'function' && mock.request(req, match(req))) {
      logger.info('Matched request function.', req.path);
      matchedMock = mock;
      break;
    } else if (typeof mock.request === 'object' && match(req)(mock.request)) {
      logger.info(
        `Matched request object: ${util.inspect(mock.request, {
          colors: true,
          breakLength: Infinity,
        })}`,
        req.path
      );
      matchedMock = mock;
      break;
    }
  }

  return matchedMock;
}
