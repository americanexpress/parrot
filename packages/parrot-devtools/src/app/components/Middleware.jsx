/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Middleware extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    loading: true,
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.loadScenarios(this.props.url);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps({ url: nextUrl }) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.url !== nextUrl) {
      this.loadScenarios(nextUrl);
    }
  }

  setScenario = async scenario => {
    const { url } = this.props;
    try {
      await fetch(`${url}/parrot/scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario,
        }),
      });
      this.setState({ scenario });

      if (chrome) {
        chrome.devtools.inspectedWindow.reload(null);
      }
    } catch (e) {
      // do nothing
    }
  };

  loadScenarios = async url => {
    this.setState({ loading: true });
    try {
      const scenariosResponse = await fetch(`${url}/parrot/scenarios`);
      const scenarios = await scenariosResponse.json();
      const scenarioResponse = await fetch(`${url}/parrot/scenario`);
      const scenario = await scenarioResponse.json();
      this.setState({
        scenarios,
        scenario,
        loading: false,
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { render } = this.props;
    const { scenarios, scenario, loading } = this.state;
    return render(
      { scenarios, scenario, setScenario: this.setScenario, loadScenarios: this.loadScenarios },
      loading
    );
  }
}

Middleware.propTypes = {
  url: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export const mapStateToProps = ({ url }) => ({ url });

export default connect(mapStateToProps)(Middleware);
