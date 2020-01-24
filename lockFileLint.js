const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const invalidations = [];
const defaultLockfilePath = `${process.cwd()}/package-lock.json`;
const exampleLockfilePath = `${process.cwd()}/examples/pirate-ship-app/package-lock.json`;
const exampleClientLockfilePath = `${process.cwd()}/examples/pirate-ship-app/client/package-lock.json`;
const packagesBasePath = path.join(process.cwd(), 'packages');

const pathsToValidate = [
  defaultLockfilePath,
  exampleLockfilePath,
  exampleClientLockfilePath,
].concat(
  fs
    .readdirSync(packagesBasePath)
    .map(pathName => `${packagesBasePath}/${pathName}`)
    .filter(pathName => fs.statSync(pathName).isDirectory())
    .map(pathName => `${pathName}/package-lock.json`)
);

pathsToValidate.forEach(lockPath => {
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
