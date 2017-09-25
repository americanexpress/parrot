const sendResponse = jest.fn();

global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(cb => cb({}, null, sendResponse)),
    },
  },
  tabs: {
    get: jest.fn((tabId, cb) => cb({})),
  },
};

require('../../../src/browser/extension/background');

describe('devtools', () => {
  it('should setup tab', () => {
    expect(global.chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    expect(global.chrome.tabs.get).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalled();
  });
});
