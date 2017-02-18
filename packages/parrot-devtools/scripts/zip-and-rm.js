const fs = require('fs-extra');
const archiver = require('archiver');

module.exports = (directory, zipFile) => {
  const output = fs.createWriteStream(zipFile);
  const archive = archiver.create('zip');

  // listen for all archive data to be written
  output.on('close', () => {
    fs.removeSync(directory);
  });

  // pipe archive data to the file
  archive.pipe(output);
  archive.directory(directory, true, { date: new Date() });
  archive.finalize();
};
