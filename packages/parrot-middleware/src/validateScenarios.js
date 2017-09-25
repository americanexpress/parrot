export default function validateScenarios(scenarios) {
  Object.values(scenarios).forEach(scenario =>
    scenario.forEach(mock => {
      if (typeof mock !== 'function' && (!mock.request || !mock.response)) {
        throw new Error(
          'Each scenario must be a function or an object with keys `request` and `response`.'
        );
      }
    })
  );
}
