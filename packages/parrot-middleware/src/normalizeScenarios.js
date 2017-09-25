export default function normalizeScenarios(scenarios) {
  return Object.keys(scenarios).reduce(
    (acc, scenarioName) => ({
      ...acc,
      [scenarioName]: scenarios[scenarioName].map(
        mock =>
          typeof mock === 'function'
            ? mock
            : {
                request:
                  typeof mock.request === 'string'
                    ? {
                        path: mock.request,
                        method: 'GET',
                      }
                    : mock.request,
                response:
                  typeof mock.response !== 'object' || typeof mock.response.resource === 'undefined'
                    ? {
                        resource: mock.response,
                        statusCode: 200,
                      }
                    : {
                        ...mock.response,
                        statusCode: mock.response.statusCode || 200,
                      },
              }
      ),
    }),
    {}
  );
}
