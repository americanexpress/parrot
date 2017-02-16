import path from 'path';

module.exports = {
  entry: {
    'devtool-panel': ['./src/devtool-panel.jsx']
  },
  eslint: {
    configFile: path.resolve('.eslintrc')
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/static/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }]
  }
};
