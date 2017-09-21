import fetchApi from '../../../src/app/utils/fetchApi';

describe('fetchApi', () => {
  it('should call fetch with correct opts', () => {
    global.fetch = jest.fn(() => 'squawk');
    return fetchApi('squawk', '/squawk').then(result => {
      expect(global.fetch).toHaveBeenCalledWith('squawk/squawk', {
        headers: { Accept: 'application/json' },
      });
      expect(result).toBe('squawk');
    });
  });
});
