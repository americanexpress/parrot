import validateScenarios from '../src/validateScenarios';

describe('validateScenarios', () => {
  it('throws error if missing request or response property', () => {
    const mockConfig = {
      default: [
        {
          response: 'mocks/something.json',
        },
      ],
    };
    expect(() => {
      validateScenarios(mockConfig);
    }).toThrow('Each scenario must be a function or an object with keys `request` and `response`.');
  });
});
