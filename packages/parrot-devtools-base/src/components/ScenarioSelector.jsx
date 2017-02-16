import React, { PropTypes } from 'react';
import { Dropdown } from 'axp-base';

export const ScenarioSelector = (props) => {
  const onScenarioChange = (newVal) => {
    fetch('/scenario', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        scenario: newVal.value
      })
    })
    .catch((err) => { console.warn(err); })
    .then(() => { props.refetch(); });
  };

  const options = Object.keys(props.scenarios).map(scenario => ({
    value: scenario,
    text: scenario
  }));

  return (
    <Dropdown
      id="scenario-select"
      options={ options }
      label="Scenario"
      onChange={ onScenarioChange }
      value={ props.selected }
    />
  );
};

ScenarioSelector.propTypes = {
  selected: PropTypes.string,
  scenarios: PropTypes.object,
  refetch: PropTypes.func
};

ScenarioSelector.defaultProps = {
  refetch: () => location.reload()
};

export default ScenarioSelector;
