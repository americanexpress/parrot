export default function validateScenarios(scenarios) {
  const scenarioNames = Object.keys(scenarios);
  Object.values(scenarios).forEach((scenario, scenarioIndex) =>
    scenario.forEach((mock, mockIndex) => {
      if (typeof mock !== 'function' && (!mock.request || !mock.response)) {
        throw new Error(
          `Mock ${mockIndex} in scenario '${scenarioNames[
            scenarioIndex
          ]}' is not an object with keys request and response or a function.`
        );
      }
    })
  );
}
