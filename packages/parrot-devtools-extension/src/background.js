// This is necessary because the chrome.tab API is not exposed to the dev panel.
chrome.runtime.onMessage.addListener((tabId, sender, respond) =>
  chrome.tabs.get(tabId, ({ url }) => respond(url))
);
