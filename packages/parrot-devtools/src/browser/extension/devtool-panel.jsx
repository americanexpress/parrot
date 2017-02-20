import React from 'react';
import ReactDOM from 'react-dom';

import ScenarioSelector from '../../app/components/ScenarioSelector';
import DevTools from '../../app/components/DevTools';

chrome.runtime.sendMessage({ tabId: chrome.devtools.inspectedWindow.tabId }, ({ url }) => {
  ReactDOM.render(
    <DevTools render={() => <ScenarioSelector url={url} />} />,
    document.querySelector('root'),
  );
});
