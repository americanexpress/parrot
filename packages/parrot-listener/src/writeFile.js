import mkdirp from 'mkdirp';
import path from 'path';
import promisify from 'promisify-node';

// Wraps fs.writeFile to add handling for non-existing directories
const writeFile = (pathToFile, contents, writeAttempted = false) => {
  const fs = promisify('fs');
  return fs
    .writeFile(pathToFile, contents)
    .catch(err => {
      if (err.code === 'ENOENT' && !writeAttempted) {
        mkdirp(path.parse(pathToFile).dir, (err) => {
          if (err) {
            throw err;
          } else {
            return writeFile(pathToFile, contents, true);
          }
        });
      } else {
        throw err;
      }
    });
};

export default writeFile;
