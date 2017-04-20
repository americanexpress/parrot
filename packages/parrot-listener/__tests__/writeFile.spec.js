import path from 'path';
import promisify from 'promisify-node';
import mkdirp from 'mkdirp';
import writeFile from '../src/writeFile';

jest.mock('promisify-node');
jest.mock('mkdirp');
jest.mock('path');

const mockDir = '/test';
path.parse.mockImplementation(() => ({ dir: mockDir }));

describe('writeFile', () => {
  const setupFileMock = (promiseResult, arg) => {
    const writeFileMock = jest.fn(() => Promise[promiseResult](arg));
    promisify.mockImplementation(
      () => ({ writeFile: writeFileMock })
    );
    return writeFileMock;
  }
  it('can write a file', () => {
    const writeFileMock = setupFileMock('resolve', {});
    writeFile();
    expect(writeFileMock).toHaveBeenCalled();
  });

  it('will throw on error', async () => {
    const err = Error('Something Bad');
    const writeFileMock = setupFileMock('reject', err);
    // TODO USE THIS WHEN JEST 20 is out
    // return expect(writeFile()).rejects.toEqual(err);
    expect.assertions(1);
    try {
      await writeFile();
    } catch(err) {
      expect(err).toEqual(err);
    }
  });

  describe('if the directory does not exist', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('will create the output directory', async () => {
      const err = { code: 'ENOENT' };
      const writeFileMock = setupFileMock('reject', err);
      await writeFile();
      expect(mkdirp).toHaveBeenCalledWith(mockDir, expect.any(Function));
    });

    it('will throw an error if creating the directory fails', async () => {
      const err = { code: 'ENOENT' };
      const writeFileMock = setupFileMock('reject', err);
      await writeFile();
      expect(mkdirp).toHaveBeenCalled();
      const mkdirpCb = mkdirp.mock.calls[0][1];
      const mkErr = Error('Unable to create directory');
      expect(mkdirpCb.bind(this, mkErr)).toThrow(mkErr);
    });

    it('will attempt to write file after creating directory', async () => {
      // Fail dir write first time, then succeed
      const err = { code: 'ENOENT' };
      const writeFileMock = jest.fn()
        .mockImplementationOnce(() => Promise.reject(err))
        .mockImplementationOnce(() => Promise.resolve({}));
      promisify
        .mockImplementation(() => ({ writeFile: writeFileMock }));

      // First time, directory write fails
      await writeFile();
      expect(mkdirp).toHaveBeenCalled();
      const mkdirpCb = mkdirp.mock.calls[0][1];
      expect(writeFileMock).toHaveBeenCalledTimes(1);

      // Call second time - success
      mkdirpCb();
      expect(writeFileMock).toHaveBeenCalledTimes(2);
      expect(mkdirp).toHaveBeenCalledTimes(1);
    });
  })
});
