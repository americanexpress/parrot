/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
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

export default function useScenarios(url, initialScenario) {
  const [loading, setLoading] = React.useState(false);
  const [scenario, setScenario] = React.useState('');
  const [scenarios, setScenarios] = React.useState([]);

  const methods = React.useMemo(
    () => ({
      loadScenarios: async () => {
        setLoading(true);
        try {
          const scenariosResponse = await fetch(`${url}/parrot/scenarios`);
          const scenarioResponse = await fetch(`${url}/parrot/scenario`);
          // eslint-disable-next-line prettier/prettier
          setScenario( await scenarioResponse.json() );
          // eslint-disable-next-line prettier/prettier
          setScenarios( await scenariosResponse.json() );
        } catch (e) {
          // do nothing
        }
        setLoading(false);
      },
      setScenario: async selectedScenario => {
        try {
          await fetch(`${url}/parrot/scenario`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              scenario: selectedScenario,
            }),
          });

          setScenario(selectedScenario);

          if ('chrome' in window) {
            chrome.devtools.inspectedWindow.reload(null);
          }
        } catch (e) {
          // do nothing
        }
      },
    }),
    [url]
  );

  React.useLayoutEffect(() => {
    if (initialScenario) methods.setScenario(initialScenario);
    methods.loadScenarios();
  }, [url, initialScenario]);

  const [filteredScenarios, setFilteredScenarios] = React.useState(scenarios);
  const [filterValue, setFilterValue] = React.useState('');

  React.useEffect(() => {
    if (filterValue === '') {
      setFilteredScenarios(scenarios);
    } else {
      setFilteredScenarios(
        scenarios.filter(({ name }) => name.toLowerCase().includes(filterValue))
      );
    }
  }, [filterValue, scenarios]);

  return {
    loading,
    scenario,
    filteredScenarios,
    filterValue,
    setFilterValue,
    ...methods,
  };
}
