/**
 * Karma Tests Context
 * Configure where to look for src and test files
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const testContext = require.context('./test', true, /\.spec\.js$/);
testContext.keys().forEach(testContext);

const srcContext = require.context('./src', true, /\.js$/);
srcContext.keys().forEach(srcContext);
