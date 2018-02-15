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
