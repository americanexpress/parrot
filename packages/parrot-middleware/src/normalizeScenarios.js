export default function normalizeScenarios(scenarios) {
  return Object.keys(scenarios).reduce(
    (acc, scenarioName) => ({
      ...acc,
      [scenarioName]: scenarios[scenarioName].map(
        scenario =>
          typeof scenario === 'function'
            ? scenario
            : {
                request:
                  typeof scenario.request === 'string'
                    ? {
                        path: scenario.request,
                        method: 'GET',
                      }
                    : scenario.request,
                response:
                  typeof scenario.response !== 'object' ||
                  typeof scenario.response.resource === 'undefined'
                    ? {
                        resource: scenario.response,
                        statusCode: 200,
                      }
                    : {
                        ...scenario.response,
                        statusCode: scenario.response.statusCode || 200,
                      },
              }
      ),
    }),
    {}
  );
}
