import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import fetchApi from '../../utils/fetchApi';

export default class ListenerControls extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  state = {
    scenarioName: '',
    error: false,
    isListening: false,
  };

  // Check if listener is currently running
  componentDidMount() {
    fetchApi(this.props.url, '/parrot/listen')
      .then(resp => resp.json())
      .then(config => this.setState(config))
      .catch(error => this.setState({ error }));
  }

  setName = (event, scenarioName) => this.setState({ scenarioName });

  toggleListening = () => {
    const { isListening, scenarioName } = this.state;
    fetchApi(this.props.url, '/parrot/listen', {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: isListening ? 'STOP' : 'START',
        scenarioName,
      }),
    })
      .then(() => this.setState({ isListening: !isListening }))
      .catch(error => this.setState({ error }));
  };

  render() {
    const { isListening, scenarioName, error } = this.state;
    const toggleLabel = `${isListening ? 'Stop' : 'Start'} Listening`;
    return (
      <div>
        {error && <div><pre>{error}</pre></div>}
        <TextField
          name="Scenario Name"
          floatingLabelText="Scenario Name"
          value={scenarioName}
          onChange={this.setName}
          disabled={isListening}
        />
        <RaisedButton
          label={toggleLabel}
          primary={!isListening}
          secondary={isListening}
          onTouchTap={this.toggleListening}
          disabled={scenarioName === ''}
        />
      </div>
    );
  }
}
