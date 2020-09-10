/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Content } from './styled';
import Scenarios from './Scenarios';
import Toolbar from './Toolbar';
import { useScenarios } from '../hooks';

function ScenariosDisplay({ url }) {
  const scenariosData = useScenarios(url);
  return (
    <Fragment>
      <Toolbar scenariosData={scenariosData} />
      <Content>
        <Scenarios scenariosData={scenariosData} />
      </Content>
    </Fragment>
  );
}

ScenariosDisplay.propTypes = {
  url: PropTypes.string.isRequired,
};

export const mapStateToProps = ({ url }) => ({ url });

export const ComponentUnderTest = ScenariosDisplay;
export default connect(mapStateToProps)(ScenariosDisplay);
