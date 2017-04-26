import setupCmdArgs from '../src/setupCmdArgs';

describe('setupCmdArgs', () => {
  it('sets up yargs', () => {
    const yargs = { option: jest.fn(() => yargs) };
    setupCmdArgs(yargs);
    expect(yargs.option).toHaveBeenCalledTimes(2);
  });
});
