import ejs from 'ejs';
import path from 'path';
import promisify from 'promisify-node';
import writeFile from './writeFile';

const writeScenarioFile = (name, routes, outputDir) => {
  const fs = promisify('fs');
  const templateString = fs.readFileSync(path.join(__dirname, './scenario.ejs'), 'utf-8');
  const contents = ejs.render(templateString, {
    name,
    routes,
  });
  return writeFile(path.join(__dirname, outputDir, name, 'scenario.js'), contents);
};

export default writeScenarioFile;
