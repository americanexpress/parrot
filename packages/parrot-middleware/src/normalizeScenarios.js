export default function normalizeScenarios(scenarios) {
  return Object.keys(scenarios).reduce(
    (acc, scenarioName) => ({
      ...acc,
      [scenarioName]: scenarios[scenarioName].map(mock => {
        if (typeof mock === 'function') {
          return mock;
        }

        const { request, response, response: { statusCode = 200 } } = mock;
        const normalized = {
          request,
          response: { ...response, statusCode },
        };

        if (typeof request === 'string') {
          normalized.request = {
            path: request,
            method: 'GET',
          };
        }

        if (typeof response !== 'object' || typeof response.resource === 'undefined') {
          normalized.response = {
            resource: response,
            statusCode: 200,
          };
        }

        return normalized;
      }),
    }),
    {}
  );
}
