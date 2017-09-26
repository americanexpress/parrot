import React from 'react';
import ReactDOM from 'react-dom';

import DevTools from '../../app/components/DevTools';

chrome.runtime.sendMessage({ tabId: chrome.devtools.inspectedWindow.tabId }, () => {
  ReactDOM.render(<DevTools />, document.querySelector('root'));
});
