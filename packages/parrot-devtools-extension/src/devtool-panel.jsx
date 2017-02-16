import React from 'react';
import { render } from 'react-dom';

import Panel from 'parrot-devtools-base';

chrome.runtime.sendMessage(chrome.devtools.inspectedWindow.tabId, (url) => {
  render(<Panel url={url} />, document.querySelector('root'));
});
