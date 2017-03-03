import loadSwagger, { fetchSwagger } from '../src/loadSwagger';

jest.mock('fs');
jest.mock('isomorphic-fetch');

describe('Spec: loadSwagger', () => {
  let fetch;
  let fs;
  const mockSchemaText = '{ "schema": "text" }';
  const mockFileSchemaText = '{ "schema": "fileText" }';

  beforeEach(() => {
    fetch = require('isomorphic-fetch');
    fs = require('fs');
    fetch.mockImplementation(() => Promise.resolve({ text: jest.fn(() => mockSchemaText )}));
    fs.readFileSync.mockImplementation(() => mockFileSchemaText);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSwagger', () => {
    it('fetches the swagger schema', async () => {
      const result = await fetchSwagger('/test');
      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(mockSchemaText);
    });

    it('caches the swagger locally', async () => {
      const result = await fetchSwagger('/test');
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('loadSwagger', () => {
    it('errors if no swagger url is provided', async () => {
      expect.assertions(1); // to be sure that `await` throws error and `expect` has been called
      try {
        await loadSwagger();
      } catch (err) {
        expect(err.message).toEqual('Missing swagger JSON url in validator config.');
      }
    });

    it('tries to call fetchSwagger to load schema', async () => {
      const result = await loadSwagger('/test');
      expect(fetch).toHaveBeenCalled();
      expect(fs.readFileSync).not.toHaveBeenCalled();
      expect(result).toEqual(JSON.parse(mockSchemaText));
    });

    it('loads schema from local cached file if fetch fails', async () => {
      fetch.mockImplementation(() => { throw Error('Fail the fetch') });
      const result = await loadSwagger('/test');
      expect(fetch).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(result).toEqual(JSON.parse(mockFileSchemaText));
    });

    it('throws error if unable to fetch from remote or local cache', async () => {
      fetch.mockImplementation(() => { throw Error('Fail the fetch'); });
      fs.readFileSync.mockImplementation(() => { throw Error('Fail the file read'); });
      expect.assertions(3); // to be sure that `await` throws error and `expect` has been called
      try {
        await loadSwagger('/test');
      } catch (err) {
        expect(fetch).toHaveBeenCalled();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(err.message).toEqual('Arr! The Swagger definitions could not'
          + ' be fetched and do not exist'
          + ' locally. Your responses will not be validated.');
      }
    });

    it('throws error if unable to parse the swagger JSON', async () => {
      const invalidJsonSchema = '{ invalid: "missing a quote }';
      fetch.mockImplementation(() => Promise.resolve({ text: jest.fn(() => invalidJsonSchema )}));
      expect.assertions(3); // to be sure that `await` throws error and `expect` has been called
      try {
        await loadSwagger('/test');
      } catch (err) {
        expect(fetch).toHaveBeenCalled();
        expect(fs.readFileSync).not.toHaveBeenCalled();
        expect(err.message).toMatch(/^JSON parse failed:/);
      }
    });
  });
});
