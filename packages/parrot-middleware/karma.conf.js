/**
 * Karma Tests Configuration
 */

const path = require('path');
const webpackConfig = require('./webpack.config.test');

const TEST_OUTPUT_DIR = 'test-results';

module.exports = (config) => {
  config.set({

    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['phantomjs-shim', 'mocha', 'chai-as-promised', 'chai'],
    files: ['tests.bundle.js'],
    preprocessors: {
      'tests.bundle.js': ['webpack', 'sourcemap'],
    },

    // reporters and their configs
    reporters: ['spec', 'coverage', 'junit'],

    specReporter: {
      showErrorSummary: false,
    },

    coverageReporter: {
      dir: TEST_OUTPUT_DIR,
      subdir: (browser) => path.join(browser.replace(/ /g, '_'), 'coverage'),
      reporters: [
        { type: 'text' },
        { type: 'html' },
      ],
      check: {
        global: {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50,
          excludes: [],
          overrides: {},
        },
        each: {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50,
          excludes: [],
          overrides: {},
        },
      },
    },

    junitReporter: {
      outputDir: TEST_OUTPUT_DIR,
      outputFile: 'junit.xml',
    },

    webpack: webpackConfig,

  });
};
