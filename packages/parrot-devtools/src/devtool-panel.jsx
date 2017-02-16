import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as url from 'url';

import Panel from 'parrot-devtools';

chrome.runtime.sendMessage(chrome.devtools.inspectedWindow.tabId, (url) =>
  ReactDOM.render(<Panel url={url} />, document.querySelector('root'));
);
