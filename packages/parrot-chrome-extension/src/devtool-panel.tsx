import * as url from 'url';

import * as React from 'react';
import * as ReactDOM from 'react-dom';


import { Dropdown } from 'axp-base';

// styles
import 'axp-dls/dist/styles/dls.min.css';
import 'axp-base/axp-base.scss';

interface IScenario {
  request: string;
  response: string;
};

interface IScenarios {
  [index: string]: IScenario;
}

class Panel extends React.Component<any, {
  error?: any,
  loading?: boolean,
  scenarios?: IScenarios,
  dropdownValue?: string,
  baseUrl?: any
}> {
  state = {
    loading: true,
    scenarios: {},
    dropdownValue: "",
    error: null,
    baseUrl: {}
  };

  normalizeScenarios(scenarios) {
    const normalized = [];
    for(let key in scenarios) {
      normalized.push({
        label: key,
        value: key
      });
    }

    return normalized;
  }

  setScenario = ({ value: dropdownValue }) => {

    chrome.runtime.sendMessage({ debug: true, dropdownValue });

    this.setState({
      dropdownValue
    }, async () => {

      const scenarioUrl = url.format({ ...this.state.baseUrl, pathname: 'scenario' });

      try {
        const resp = await fetch(scenarioUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            scenario: dropdownValue
          })
        });

        if (resp.ok) {
          chrome.devtools.inspectedWindow.reload(null);
        }
      } catch(e) {
        this.setState({
          error: e
        });
      }
    });
  }

  componentDidMount() {
    const tabId = chrome.devtools.inspectedWindow.tabId;

    chrome.runtime.sendMessage({ tabId }, async (res) => {
      const tabUrl = url.parse(res.url);

      const baseUrl = {
        host: tabUrl.host,
        port: tabUrl.port,
        protocol: tabUrl.protocol
      };

      const scenariosUrl = url.format({...baseUrl, pathname: 'scenarios' });

      chrome.runtime.sendMessage({ debug: true, url: scenariosUrl });

      try {
        const resp = await fetch(scenariosUrl, {
          headers: {
            Accept: 'application/json'
          },
          mode: 'cors'
        });

        const body = await resp.json();

        const keys = Object.keys(body);

        this.setState({
          loading: false,
          scenarios: body,
          dropdownValue: keys[0],
          baseUrl
        });
      } catch(e) {
        chrome.runtime.sendMessage({ debug: true, error: JSON.stringify(e.stack, null, 4) });

        this.setState({
          error: e
        });
      }
    });
  }

  render() {
    if (this.state.error) {
      return <pre>{this.state.error.message}</pre>;
    }

    if (this.state.loading) {
      return <p>loading...</p>;
    }

    return (
      <div className="pad">
        <Dropdown
          id="scenarios"
          label='Scenarios'
          options={this.normalizeScenarios(this.state.scenarios)}
          value={this.state.dropdownValue}
          onChange={this.setScenario}
        />
      </div>
    );
  }
}

try {
  ReactDOM.render(<Panel />, document.querySelector('root'));
} catch(e) {
  const error: Error = e;
  ReactDOM.render(<p>{error.message}</p>, document.querySelector('root'));
}
