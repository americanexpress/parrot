import Mock from './Mock';

let scenarios = {};
let scenario;

function createMethod(method) {
  return path => {
    const initialMock = new Mock({
      request: {
        method,
        path,
      },
      response: {},
    });
    scenario.push(initialMock.structure);
    return initialMock;
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

export function mock(structure) {
  const initialMock = new Mock(structure);
  scenario.push(initialMock.structure);
  return initialMock;
}

export function request(structure) {
  const initialMock = new Mock({
    request: structure,
    response: {},
  });
  scenario.push(initialMock.structure);
  return initialMock;
}

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
