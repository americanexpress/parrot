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

import parrotLogo from '../../assets/img/parrot_128x.png';

import { useDevTools } from '../hooks';

import { Container, Content, Navigation, Logo } from './styled';
import Settings from './Settings';
import ScenariosDisplay from './ScenariosDisplay';

export default function DevTools() {
  const { showSettings, toggleSettings } = useDevTools();

  return (
    <Container className="pad-1 dls-accent-white-01-bg">
      <Content className={showSettings ? '' : 'display-none'}>
        <Settings />
      </Content>
      <ScenariosDisplay className={showSettings ? 'display-none' : ''} />
      <Navigation className="pad-1-t flex flex-align-center flex-justify-between">
        <Logo src={parrotLogo} />
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          onClick={toggleSettings}
          className={`btn-icon btn-inline ${
            showSettings ? 'btn-primary' : 'btn-tertiary'
          } dls-icon-setting`}
          title={showSettings ? 'Hide settings' : 'Show settings'}
        />
      </Navigation>
    </Container>
  );
}
