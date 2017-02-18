/* eslint react/jsx-filename-extension: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Panel from './components/Panel';
import DevTools from './components/DevTools';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <DevTools>
    <Panel />
  </DevTools>,
  document.querySelector('root'),
);
