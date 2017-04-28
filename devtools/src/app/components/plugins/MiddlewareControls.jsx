import React, { Component } from 'react';
import PropTypes from 'prop-types';
import url from 'url';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import fetchApi from '../../utils/fetchApi';

class MiddlewareControls extends Component {
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
      const resp = await fetchApi(this.props.url, '/parrot/scenarios');
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
        fetchApi(this.props.url, '/parrot/scenario', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scenario,
          }),
        });
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
        style={{width: '100%'}}
        floatingLabelText="Selected Scenario"
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

export default MiddlewareControls;
