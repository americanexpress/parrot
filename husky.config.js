module.exports = {
  hooks: {
    'pre-commit': 'npm run test',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
