import React, { Component, PropTypes } from 'react';
import url from 'url';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

class ScenarioSelector extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  }

  state = {
    loading: true,
    scenarios: {},
    scenario: '',
    error: null,
  };

  async componentDidMount() {
    try {
      const resp = await fetch(this.createUrl('/scenarios'), {
        headers: {
          Accept: 'application/json',
        },
      });

      const scenarios = await resp.json();
      const keys = Object.keys(scenarios);

      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        loading: false,
        scenarios,
        scenario: keys[0],
      });
    } catch (error) {
      this.setState({ error }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  setScenario = (event, key, scenario) => {
    this.setState({
      scenario,
    }, async () => {
      try {
        const resp = await fetch(this.createUrl('/scenario'), {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scenario,
          }),
        });

        if (!resp.ok) {
          this.setState({ error: resp.statusText });
        } else if (chrome) { // Reload if we are in chrome
          chrome.devtools.inspectedWindow.reload(null);
        }
      } catch ({ message: error }) {
        this.setState({ error });
      }
    });
  }

  createUrl = pathname => url.format({ ...url.parse(this.props.url), pathname })

  render() {
    if (this.state.error) {
      return <pre>{this.state.error}</pre>;
    } else if (this.state.loading) {
      return <CircularProgress />;
    }

    return (
      <SelectField
        floatingLabelText="Scenario"
        value={this.state.scenario}
        onChange={this.setScenario}
      >
        {Object.keys(this.state.scenarios).map(scenario =>
          <MenuItem key={scenario} value={scenario} primaryText={scenario} />,
        )}
      </SelectField>
    );
  }
}

export default ScenarioSelector;
