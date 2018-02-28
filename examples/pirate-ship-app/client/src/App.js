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

import React, { Component } from 'react';

class App extends Component {
  state = {
    loading: true,
    error: false,
  };

  async componentDidMount() {
    try {
      const shipLogResponse = await fetch('/ship_log');
      const shipLog = await shipLogResponse.json();
      this.setState({ shipLog, loading: false });
    } catch (e) {
      this.setState({ loading: false, error: true });
    }
  }

  render() {
    const { loading, error, shipLog } = this.state;
    if (loading) {
      return null;
    } else if (error) {
      return <h2>Arrr!</h2>;
    }

    return (
      <table className="u-full-width">
        <thead>
          <tr>
            <th>Name</th>
            <th>Captain</th>
          </tr>
        </thead>
        <tbody>
          {shipLog.map(({ name, captain }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{captain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default App;
