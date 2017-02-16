const webpack = require('webpack');

module.exports = {
  entry: {
    'devtool-panel': ['./src/devtool-panel.tsx'],
    'devtools': ['./src/devtools.ts'],
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/static/',
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.s?css$/, loaders: ['style-loader', 'css-loader', 'sass-loader', 'import-glob-loader'] },
      { test: /\.woff|\.woff2|\.svg|.eot|\.ttf/, loader: 'url-loader' }
    ]
  }
}
