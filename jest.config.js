module.exports = {
  preset: 'amex-jest-preset-react',
  collectCoverageFrom: ['packages/*/src/**/*.{js,jsx}'],
  moduleNameMapper: {
    '\\.png': 'identity-obj-proxy',
  },
  setupFiles: ['./jest.setup.js', './packages/parrot-core/jest.setup.js'],
};
