/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setUrl as setUrlAction } from '../ducks';
import { Scrollable } from './styled';

const Settings = ({ url, setUrl }) => (
  <Scrollable>
    <div className="pad-1">
      <h1 className="heading-5 pad-b">Settings</h1>
      <div className="form-group">
        <label htmlFor="url">
          <span>Middleware URL</span>

          <input
            id="url"
            onBlur={({ target: { value } }) => setUrl(value)}
            defaultValue={url}
            className="form-control"
          />
        </label>
      </div>
    </div>
  </Scrollable>
);

Settings.propTypes = {
  url: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
};

export const mapStateToProps = ({ url }) => ({ url });

export const mapDispatchToProps = dispatch => ({
  setUrl: url => dispatch(setUrlAction(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
