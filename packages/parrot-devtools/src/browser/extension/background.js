// This is necessary because the chrome.tab API is not exposed to the dev panel.
chrome.runtime.onMessage.addListener(({ tabId }, sender, sendResponse) => {
  chrome.tabs.get(tabId, ({ url }) => sendResponse({ url }));

  // returning true tells chrome to keep the message port open until
  // the async chrome.tabs above returns and sendResponse is called
  return true;
});
