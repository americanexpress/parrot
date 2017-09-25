import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import styled from 'styled-components';

// Material UI Components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

// Plugin Settings Components
import ListenerControls from './plugins/ListenerControls';
import GeneralControls from './plugins/GeneralControls';
import MiddlewareControls from './plugins/MiddlewareControls';

import fetchApi from '../utils/fetchApi';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const pluginsConfig = {
  'parrot-middleware': {
    component: MiddlewareControls,
    label: 'Middleware Settings',
  },
  'parrot-listener': {
    component: ListenerControls,
    label: 'Listener Settings',
  },
};

const DevSection = styled.div`padding-top: 20px;`;
const DevHeader = styled.h5`margin: 0;`;

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
    url: PropTypes.string,
  };

  static defaultProps = {
    url: 'http://localhost:3000',
  };

  state = {
    plugins: [],
    url:
      (window && window.localStorage && window.localStorage.getItem('parrotHostname')) ||
      this.props.url,
    error: false,
  };

  componentDidMount() {
    this.loadSections().catch(error => this.setState({ error }));
  }

  setUrl = url => {
    this.setState({ url });
    if (window && window.localStorage) {
      window.localStorage.setItem('parrotHostname', url);
    }
  };

  loadSections = async () => {
    // Empty cache
    this.setState({ error: false, plugins: [] });
    try {
      const resp = await fetchApi(this.state.url, '/parrot/registry');
      const registry = await resp.json();
      if (registry && registry.middlewares) {
        this.setState({ plugins: registry.middlewares });
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    let pluginSections;
    if (this.state.error) {
      pluginSections = (
        <DevSection>
          <h4>Squawk! Error alert!</h4>
          <p>
            Cannot find any Parrot plugins registered, can you check that Parrot is running on that
            hostname?
          </p>
        </DevSection>
      );
    } else if (this.state.plugins.length > 0) {
      pluginSections = this.state.plugins.map(pluginKey => pluginsConfig[pluginKey] || {}).map(
        ({ label, component: SectionComponent }) =>
          label && SectionComponent ? (
            <div>
              <DevSection>
                <DevHeader>{label}</DevHeader>
                <SectionComponent url={this.state.url} />
              </DevSection>
            </div>
          ) : null
      );
    } else {
      pluginSections = (
        <DevSection>
          <CircularProgress />
        </DevSection>
      );
    }

    return (
      <MuiThemeProvider>
        <Paper style={paperStyle}>
          {pluginSections}
          {/* General Settings are always shown */}
          <DevSection>
            <DevHeader>Parrot Settings</DevHeader>
            <GeneralControls
              url={this.state.url}
              setUrl={this.setUrl}
              onRefresh={this.loadSections}
            />
          </DevSection>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default DevTools;
