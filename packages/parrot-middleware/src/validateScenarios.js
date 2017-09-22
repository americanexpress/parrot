export default function validateScenarios(scenarios) {
  Object.values(scenarios).forEach(scenario =>
    scenario.forEach(mock => {
      if (typeof mock !== 'function' && (!mock.request || !mock.response)) {
        throw Error(
          'Your route config must be a function or an object with keys `request` and `response`.'
        );
      }
    })
  );
}
