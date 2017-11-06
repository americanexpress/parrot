import { validateScenarios } from '../src';

describe('validateScenarios', () => {
  it('throws error if missing request or response property', () => {
    const mockConfig = {
      default: [
        {
          request: '/path/to/something',
          response: 'mocks/something.json',
        },
        {
          request: {},
        },
      ],
    };
    expect(() => {
      validateScenarios(mockConfig);
    }).toThrow(
      "Mock 1 in scenario 'default' is not an object with keys request and response or a function."
    );
  });
});
