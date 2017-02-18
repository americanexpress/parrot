import React, { Component, PropTypes } from 'react';
import url from 'url';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

const paperStyle = {
  position: 'absolute',
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

class Panel extends Component {
  static propTypes = {
    url: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    url: 'http://localhost:3000',
  }

  state = {
    loading: true,
    scenarios: {},
    dropdownValue: '',
    error: null,
  };

  async componentDidMount() {
    this.baseUrl = url.parse(this.props.url);
    const scenariosUrl = url.format({ ...this.baseUrl, pathname: '/scenarios' });

    try {
      const resp = await fetch(scenariosUrl, {
        headers: {
          Accept: 'application/json',
        },
      });

      const scenarios = await resp.json();
      const keys = Object.keys(scenarios);

      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        loading: false,
        scenarios,
        dropdownValue: keys[0],
      });
    } catch (error) {
      this.setState({ error }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  setScenario = ({ value: dropdownValue }) => {
    this.setState({
      dropdownValue,
    }, async () => {
      const scenarioUrl = url.format({ ...this.baseUrl, pathname: '/scenario' });

      try {
        const resp = await fetch(scenarioUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scenario: dropdownValue,
          }),
        });

        // Reload if we are in chrome
        if (chrome && resp.ok) {
          chrome.devtools.inspectedWindow.reload(null);
        }
      } catch (error) {
        this.setState({ error });
      }
    });
  }

  getContent() {
    if (this.state.error) {
      return <pre>{this.state.error.message}</pre>;
    } else if (this.state.loading) {
      return <CircularProgress />;
    }

    return (
      <DropDownMenu
        value={this.state.dropdownValue}
        onChange={this.setScenario}
      >
        {Object.keys(this.state.scenarios).map(scenario =>
          <MenuItem value={scenario} primaryText={scenario} />,
        )}
      </DropDownMenu>
    );
  }

  render() {
    return (
      <Paper style={paperStyle}>
        {this.getContent()}
      </Paper>
    );
  }
}

export default Panel;
