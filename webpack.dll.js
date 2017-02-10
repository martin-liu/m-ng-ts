const webpack = require('webpack'),
      path = require('path'),
      WebpackConfig = require('webpack-config');

const vendors = require('./webpack.vendor.js');

var baseConfig = new WebpackConfig().extend("webpack.config");
baseConfig.module.rules = baseConfig.module.rules.map(function(rule){
  if (rule.test.test) {
    if (rule.test.test('.woff')) {
      rule.loader = "url-loader?limit=1000000&mimetype=application/font-woff";
    } else if (rule.test.test('.eot')) {
      rule.loader = "url-loader?limit=1000000";
    }
  }
  return rule;
});

module.exports = {
  output: {
    path: path.resolve(__dirname, './app/assets/dll'),
    filename: '[name].dll.js',
    library: '[name]_[chunkhash]'
  },
  entry: {
    vendor: vendors
  },
  module: baseConfig.module,
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    }),
    new webpack.DllPlugin({
      path: './app/assets/dll/[name]-manifest.json',
      name: '[name]_[chunkhash]',
      context: __dirname
    })
  ]
};
