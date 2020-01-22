function normalizeMock(mock) {
  if (!mock.request || !mock.events) {
    throw new Error('Invalid');
  }

  const { request, events } = mock;

  const normalizedRequest = typeof request === 'string' ? { path: request } : request;

  return { request: normalizedRequest, events };
}

export default function normalizeScenarios(scenarios) {
  const normalizedContainer = Array.isArray(scenarios)
    ? scenarios.reduce((acc, { name, mocks }) => ({ ...acc, [name]: mocks }), {})
    : scenarios;

  return Object.keys(normalizedContainer).reduce(
    (acc, name) => ({
      ...acc,
      [name]: normalizedContainer[name].map((mock, mockIndex) => {
        try {
          return normalizeMock(mock);
        } catch (err) {
          throw new Error(
            `Mock ${mockIndex} in scenario '${name}' is not an object with keys request and events.`
          );
        }
      }),
    }),
    {}
  );
}
