import util from 'util';
import isEqual from 'lodash/isEqual';
import pathToRegexp from 'path-to-regexp';

function match(req, logger) {
  return request => {
    const properties = Object.keys(request);
    for (let index = 0; index < properties.length; index += 1) {
      const property = properties[index];

      if (
        (property === 'path' && !pathToRegexp(request.path).exec(req.path)) ||
        (property !== 'path' && !isEqual(req[property], request[property]))
      ) {
        logger.info(
          `Not able to match parsed request property ${property}.` +
            ` Trying next route. \n\trequest: ${util.inspect(req[property])}` +
            `\n\tconfig: ${util.inspect(request[property])}`
        );
        return false;
      }
    }
    logger.setPath(request.path);
    return true;
  };
}

export default function matchMock(req, res, mocks, logger) {
  let matchedMock;
  for (let index = 0; index < mocks.length; index += 1) {
    const mock = mocks[index];
    if (typeof mock === 'function') {
      mock(req, res, match(req, logger));
      if (res.headersSent) {
        return null;
      }
    } else if (
      (typeof mock.request === 'function' && mock.request(req, match(req, logger))) ||
      (typeof mock.request === 'object' && match(req, logger)(mock.request))
    ) {
      matchedMock = mock;
      break;
    }
  }

  return matchedMock;
}
