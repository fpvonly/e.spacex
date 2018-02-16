var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR  = path.resolve(__dirname, '');

var config = {
  entry: [
    APP_DIR + '/src/app.jsx'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.(js|jsx)$/,
        include: APP_DIR
      }
    ]
  },
  devServer: {
    open: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map';
  config.devServer = {};
  config.bail = true;
  config.stats = 'verbose';
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin(),
    new GitRevisionPlugin()
  ]);
}

module.exports = config;
