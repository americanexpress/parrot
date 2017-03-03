// thanks to jest
/* global jasmine */
// this is a dev-time file
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const jasmineReporters = require('jasmine-reporters');

jasmine.getEnv().addReporter(
  new jasmineReporters.JUnitXmlReporter({
    consolidateAll: true,
    savePath: './test-results',
    filePrefix: 'junit',
  })
);
