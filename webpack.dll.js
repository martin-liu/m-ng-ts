const webpack = require('webpack'),
      WebpackConfig = require('webpack-config');

const vendors = require('./webpack.vendor.js');

var baseConfig = new WebpackConfig().extend("webpack.config");

module.exports = {
  output: {
    path: 'dist',
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]'
  },
  entry: {
    vendor: vendors
  },
  module: baseConfig.module,
  plugins: [
    new webpack.DllPlugin({
      path: './dist/manifest.json',
      name: '[name]_[chunkhash]',
      context: __dirname
    })
  ]
};
