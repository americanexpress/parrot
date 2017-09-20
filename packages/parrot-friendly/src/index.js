import Mock from './Mock';

let scenarios = {};
let scenario;

function createMethod(method) {
  return path => {
    const mock = new Mock(method, path);
    scenario.push(mock.structure);
    return mock;
  };
}

export const get = createMethod('GET');
export const head = createMethod('HEAD');
export const post = createMethod('POST');
export const put = createMethod('PUT');
export const del = createMethod('DELETE');
export const connect = createMethod('CONNECT');
export const options = createMethod('OPTIONS');
export const patch = createMethod('PATCH');

export function describe(name, block) {
  scenarios = {};
  block();
  return scenarios;
}

export function it(name, block) {
  scenarios[name] = [];
  scenario = scenarios[name];
  block();
}
