import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Panel from '../../app/components/Panel';
import DevTools from '../../app/components/DevTools';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

chrome.runtime.sendMessage({ tabId: chrome.devtools.inspectedWindow.tabId }, ({ url }) => {
  ReactDOM.render(
    <DevTools>
      <Panel url={url} />
    </DevTools>,
    document.querySelector('root'),
  );
});
