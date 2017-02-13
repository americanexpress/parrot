console.log('Background script');

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.debug) {
    console.log(message);
  } else {
    chrome.tabs.get(message.tabId, (tab) => {
      respond({
        url: tab.url
      });
    });

    // we have to return true for async responses like above
    return true;
  }
});