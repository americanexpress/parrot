const webpack = require('webpack');

module.exports = {
  entry: {
    'devtool-panel': ['./src/devtool-panel.tsx'],
    'devtools': ['./src/devtools.ts'],
    'background': ['./src/background.ts']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/static/',
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.s?css$/, loaders: ['style-loader', 'css-loader', 'sass-loader', 'import-glob-loader'] },
      { test: /\.woff|\.woff2|\.svg|.eot|\.ttf/, loader: 'url-loader' }
    ]
  },
  ts: {
    transpileOnly: true
  }
}