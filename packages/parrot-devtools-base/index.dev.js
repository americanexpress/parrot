/* eslint import/no-extraneous-dependencies: 0 */
/* eslint react/jsx-filename-extension: 0*/

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Simple from './examples/Simple';
import Unrouted from './examples/Unrouted';
import SkipStep from './examples/SkipStep';
import ProgressBar from './examples/ProgressBar';

const Index = () => <div>
  <Link to="/simple">simple example</Link><br />
  <Link to="/unrouted">unrouted example</Link><br />
  <Link to="/skip-step">skip step example</Link><br />
  <Link to="/progress-bar">progress bar example</Link><br />
</div>;

render(
  <BrowserRouter>
    <div>
      <Route path="/" exact component={Index} />
      <Route path="/simple" component={Simple} />
      <Route path="/unrouted" component={Unrouted} />
      <Route path="/skip-step" component={SkipStep} />
      <Route path="/progress-bar" component={ProgressBar} />
    </div>
  </BrowserRouter>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);
