const webpack = require('webpack'),
      path = require('path'),
      WebpackConfig = require('webpack-config');

const vendors = require('./webpack.vendor.js');

var dllConfig = new WebpackConfig().extend("webpack.config").merge({}).toObject();
dllConfig.module.rules = dllConfig.module.rules.map(function(rule){
  if (rule.test.test) {
    if (rule.test.test('.woff')) {
      rule.loader = "url-loader?limit=1000000&mimetype=application/font-woff";
    } else if (rule.test.test('.eot')) {
      rule.loader = "url-loader?limit=1000000";
    }
  }
  return rule;
});

dllConfig.output = {
  path: path.resolve(__dirname, './app/assets/dll'),
  filename: '[name].dll.js',
  library: '[name]_[chunkhash]'
};
dllConfig.entry = {
  vendor: vendors
};

dllConfig.plugins = [
  new webpack.ProvidePlugin({
    jQuery: "jquery"
  }),
  new webpack.DllPlugin({
    path: './app/assets/dll/[name]-manifest.json',
    name: '[name]_[chunkhash]',
    context: __dirname
  })
];

module.exports = dllConfig;
