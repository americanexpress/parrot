import path from 'path';

module.exports = {
  entry: './index.dev.js',
  eslint: {
    configFile: path.resolve('.eslintrc')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  }
};
