'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
    StringReplacePlugin = require('string-replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    DashboardPlugin = require('webpack-dashboard/plugin');

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
    vendor: ['angular', 'angular-route', 'angular-sanitize', 'angular-ui-bootstrap', 'highcharts',
             'highcharts-ng', 'lodash', 'restangular', 'nprogress', 'intro.js', './app/lib/locache.js',
             'bootstrap-loader', './app/lib/lib.scss']
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },

  node: {
    fs: "empty"
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
        test: require.resolve("lodash"),
        loader: "imports?define=>null" // Lodash will set `_` to global when there's define (AMD)
      },
      {
        test: require.resolve("restangular"),
        loader: "imports?_=lodash"
      },
      {
        test: require.resolve("./app/lib/locache.js"),
        loader: "imports?this=>window"
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
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
        test: require.resolve("./app/common/config.ts"),
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /__CONFIG_FILE__/ig,
              replacement: function(){
                return configFile;
              }
            },
            {
              pattern: /__ENV__/ig,
              replacement: function(){
                return env;
              }
            }
          ]
        })
      }
    ]
  },

  tslint: {
    emitErrors: true,
    failOnHint: true
  },

  postcss: function() {
    return [autoprefixer];
  },

  plugins: [
    new WebpackMd5Hash(),
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    }),
    new ngAnnotatePlugin({add: true}),
    new StringReplacePlugin(),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({name: 'manifest', chunks: ['vendor']}),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './app/index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: './app/assets',
        to: 'assets'
      }
    ])
  ]
};

if (env == 'local') {
  webpackConfig.plugins = webpackConfig.plugins.concat([new DashboardPlugin()]);
}

if (env == 'prod') {
  webpackConfig.output.filename = '[name].[chunkhash].bundle.js';
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }})
  ]);
} else {
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      exclude: ['vendor.bundle.js']
    }),
  ]);
}


module.exports = webpackConfig;
