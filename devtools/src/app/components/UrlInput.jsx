import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const textareaStyle = {
  paddingLeft: 0,
};

class UrlInput extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    setUrl: PropTypes.func.isRequired,
  }

  setUrl = (event, url) => this.props.setUrl(url);

  render() {
    return (
      <TextField
        name="Scenarios Host"
        floatingLabelText="Scenarios Host"
        defaultValue={this.props.url}
        onChange={this.setUrl}
        textareaStyle={textareaStyle}
      />
    );
  }
}

export default UrlInput;
