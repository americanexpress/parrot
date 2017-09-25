import normalizeScenarios from '../src/normalizeScenarios';

describe('normalizeScenarios', () => {
  it('converts request string shorthand', () => {
    const scenarios = {
      default: [
        {
          request: 'api/endpoint/offers',
          response: 'mocks/something.json',
        },
      ],
    };
    const { default: [{ request: { path }, response: { resource } }] } = normalizeScenarios(
      scenarios
    );
    expect(path).toEqual(scenarios.default[0].request);
    expect(resource).toEqual(scenarios.default[0].response);
  });

  it('does nothing if request and response are objects', () => {
    const scenarios = {
      default: [
        {
          request: {
            path: 'api/endpoint/offers',
            method: 'GET',
          },
          response: {
            resource: 'mocks/something.json',
          },
        },
      ],
    };
    const { default: [{ request, response }] } = normalizeScenarios(scenarios);
    expect(request).toEqual(scenarios.default[0].request);
    expect(response).toEqual({ ...scenarios.default[0].response, statusCode: 200 });
  });

  it('does nothing if mock is function', () => {
    const scenarios = { default: [() => null] };
    const { default: defaultScenario } = normalizeScenarios(scenarios);
    expect(defaultScenario).toEqual(scenarios.default);
  });
});
