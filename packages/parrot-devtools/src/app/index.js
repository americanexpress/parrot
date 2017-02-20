/* eslint react/jsx-filename-extension: 0 */

import React from 'react';
import ReactDOM from 'react-dom';

import UrlInput from './components/UrlInput';
import ScenarioSelector from './components/ScenarioSelector';
import DevTools from './components/DevTools';

ReactDOM.render(
  <DevTools
    render={({ url, setUrl }) => (
      <div>
        <div>
          <ScenarioSelector url={url} />
        </div>
        <div>
          <UrlInput url={url} setUrl={setUrl} />
        </div>
      </div>
    )}
  />,
  document.querySelector('root'),
);
