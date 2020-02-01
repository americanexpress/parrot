const { spawnSync } = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');

const lockfileGlob = '**/package-lock.json';
const ignoreGlob = '**/node_modules/**/package-lock.json';

const invalidations = [];

glob(lockfileGlob, { ignore: ignoreGlob }, (globError, lockFiles) => {
  if (globError) {
    process.stderr.write(globError);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  lockFiles.forEach(lockPath => {
    const { stderr } = spawnSync('./node_modules/.bin/lockfile-lint', [
      '-p',
      lockPath,
      '-t',
      'npm',
      '-a',
      'npm',
      '-o',
      'https:',
      '-c',
      '-i',
    ]);
    const error = stderr.toString();
    if (error) invalidations.push([lockPath, error].join(':\n\n'));
  });

  if (invalidations.length > 0) {
    process.stderr.write(invalidations.join('\n'));
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
});
