import ejs from 'ejs';
import promisify from 'promisify-node';
import path from 'path';
import writeFile from '../src/writeFile';
import writeScenarioFile from '../src/writeScenarioFile';

jest.mock('promisify-node');
jest.mock('ejs');
jest.mock('path');
jest.mock('../src/writeFile');

const mockFs = {
  readFileSync: jest.fn(),
  writeFile: jest.fn(),
};
promisify.mockImplementation(() => mockFs);
const scenarioTemplatePath = '/dir/scenario.ejs';
const scenarioFileNamePath = '/otherDir/myScenarioName.js';
ejs.render.mockImplementation(() => 'some string');

describe('mockScenarioFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    path.join
      .mockImplementationOnce(() => scenarioTemplatePath)
      .mockImplementationOnce(() => scenarioFileNamePath);
  });
  it('reads a scenario template', () => {
    writeScenarioFile();
    expect(mockFs.readFileSync).toHaveBeenCalledWith(scenarioTemplatePath, 'utf-8');
  });
  it('writes a scenario file', () => {
    writeScenarioFile();
    expect(writeFile).toHaveBeenCalledWith(scenarioFileNamePath, 'some string');
  });
});
