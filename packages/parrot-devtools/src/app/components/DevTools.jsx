import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const paperStyle = {
  position: 'absolute',
  padding: '0 20',
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

class DevTools extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    url: PropTypes.string,
  }

  static defaultProps = {
    url: 'http://localhost:3000',
  }

  state = {
    url: this.props.url,
  }

  setUrl = url => this.setState({ url });

  render() {
    return (
      <MuiThemeProvider>
        <Paper style={paperStyle}>
          {this.props.render({ url: this.state.url, setUrl: this.setUrl })}
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default DevTools;
