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

import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar, ClearButton } from './styled';

const Toolbar = ({ scenariosData }) => {
  const { filterValue, setFilterValue } = scenariosData;
  const handleFilterChange = e => {
    scenariosData.setFilterValue(e.target.value.toLowerCase());
  };
  return (
    <div className="pad-1-b flex flex-justify-center flex-align-items-center">
      <SearchBar
        value={filterValue}
        onChange={handleFilterChange}
        placeholder="filter scenarios..."
      />
      <ClearButton className="dls-glyph-cancel-circle" onClick={() => setFilterValue('')} />
    </div>
  );
};

export default Toolbar;

Toolbar.propTypes = {
  scenariosData: PropTypes.shape({
    filterValue: PropTypes.string,
    setFilterValue: PropTypes.func,
  }).isRequired,
};
