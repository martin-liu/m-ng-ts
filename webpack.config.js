'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
    StringReplacePlugin = require('string-replace-webpack-plugin');

// env based config file
var arg = process.argv[2];
var env;
if (arg === '--dev'){
  env = 'dev';
} else if (arg === '--prod'){
  env = 'prod';
} else {
  env = 'local';
}

let configFile = '../config/config.ts';
if (env != 'local') {
  configFile = '../config/config.' + env + '.ts';
}

var webpackConfig = {

  entry: {
    app: './app/core/bootstrap.ts',
    vendor: ['angular', 'angular-route', 'angular-sanitize', 'angular-ui-bootstrap',
             'lodash', 'restangular', 'nprogress', 'intro.js', './app/lib/locache.js',
             'bootstrap-loader', './app/lib/lib.scss']
  },

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },

  module: {

    preloaders: [
      {
        test: /\.ts$/,
        loader: 'tslint'
      }
    ],

    loaders: [
      {
        test: require.resolve("./app/lib/locache.js"),
        loader: "imports?this=>window"
      },
      {
        test: /\.html$/,
        loader: 'raw'
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!postcss!sass'
      },
      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery'
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        loader: 'file'
      },
      {
        test: /\.ts$/,
        loader: StringReplacePlugin.replace(['awesome-typescript-loader'], {
          replacements: [
            {
              pattern: /__CONFIG_FILE__/ig,
              replacement: function(){
                return configFile;
              }
            }
          ]
        })
      }
    ]
  },

  postcss: function() {
    return [autoprefixer];
  },

  node: {
    fs: "empty"
  },

  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    }),
    new ngAnnotatePlugin({add: true}),
    new StringReplacePlugin(),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      exclude: ['vendor.bundle.js']
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './app/index.html',
      inject: true,
      hash: true
    })
  ]
};

if (env == 'prod') {
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }})
  ]);
}

module.exports = webpackConfig;
