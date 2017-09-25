import util from 'util';
import isEqual from 'lodash/isEqual';
import pathToRegexp from 'path-to-regexp';
import logger from './utils/Logger';

function match(req) {
  return request => {
    const properties = Object.keys(request);
    for (let index = 0; index < properties.length; index += 1) {
      const property = properties[index];

      if (
        (property === 'path' && !pathToRegexp(request.path).exec(req.path)) ||
        (property !== 'path' && !isEqual(req[property], request[property]))
      ) {
        return false;
      }
    }
    return true;
  };
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
