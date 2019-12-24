import path from 'path';

module.exports = {
  entry: {
    'extension/devtool-panel': ['./src/browser/extension/devtool-panel.js'],
    'extension/devtools': ['./src/browser/extension/devtools.js'],
    'extension/background': ['./src/browser/extension/background.js'],
    'base/devtools': ['./src/app/index.js'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 versions', 'IE 10'],
                  node: '4.4.7',
                },
                modules: false,
              },
            ],
            'react',
            'stage-0',
          ],
        },
      },
      {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png',
      },
    ],
  },
};
