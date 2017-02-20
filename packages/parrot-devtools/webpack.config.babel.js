import path from 'path';

module.exports = {
  entry: {
    'chrome/devtool-panel': ['./src/browser/extension/devtool-panel.jsx'],
    'chrome/devtools': ['./src/browser/extension/devtools.js'],
    'chrome/background': ['./src/browser/extension/background.js'],
    'base/devtools': ['./src/app/index.js'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.s?css$/,
      loader: 'style-loader!css-loader!sass-loader!import-glob-loader',
      exclude: /node_modules/,
    }],
  },
};
