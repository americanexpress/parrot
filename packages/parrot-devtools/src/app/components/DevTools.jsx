import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const DevTools = ({ children }) =>
  <MuiThemeProvider>
    {children}
  </MuiThemeProvider>;

DevTools.propTypes = {
  children: PropTypes.node,
};

DevTools.defaultProps = {
  children: null,
};

export default DevTools;
