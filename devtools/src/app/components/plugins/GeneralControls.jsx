import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

const textareaStyle = {
  paddingLeft: 0,
};

class GeneralControls extends Component {
  static proptypes = {
    url: PropTypes.string.isRequired,
    setUrl: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
  }

  setUrl = (event, url) => this.props.setUrl(url);

  render() {
    const { url, onRefresh } = this.props;
    return (
      <div>
        <TextField
          name="Parrot Server Host"
          floatingLabelText="Parrot Server Host"
          value={url}
          onChange={this.setUrl}
          textareaStyle={textareaStyle}
        />
        <FlatButton
          icon={<RefreshIcon />}
          onTouchTap={onRefresh}
        />
      </div>
    );
  }
}


export default GeneralControls;
