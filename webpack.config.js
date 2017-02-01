'use strict';

var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    precss = require('precss'),
    autoprefixer = require('autoprefixer'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
    StringReplacePlugin = require('string-replace-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash');

// env based config file
var arg = process.argv[2];
var env;
if (arg === '--env=dev'){
  env = 'dev';
} else if (arg === '--env=prod'){
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
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },

  node: {
    fs: "empty"
  },

  module: {

    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        exclude: /(node_modules)/,
        options: {
          emitErrors: true,
          failOnHint: true,
          configuration: {
            rules: {
              quotemark: false
            }
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          'sass-loader'
        ]
      },

      {
        test: require.resolve("lodash"),
        loader: "imports-loader?define=>null" // Lodash will set `_` to global when there's define (AMD)
      },
      {
        test: require.resolve("restangular"),
        loader: "imports-loader?_=lodash"
      },
      {
        test: require.resolve("./app/lib/locache.js"),
        loader: "imports-loader?this=>window"
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
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports-loader?jQuery=jquery'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(eot|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        loader: 'file-loader'
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

  performance: {
    hints: false
  },

  plugins: [
    new WebpackMd5Hash(),
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    }),
    new ngAnnotatePlugin({add: true}),
    new StringReplacePlugin(),
    new webpack.optimize.CommonsChunkPlugin({name: ['vendor', 'manifest']}),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './app/index.html',
      inject: true,
      chunksSortMode: function(a, b) {
        var map = {
          manifest: 1,
          vendor: 2,
          app: 3
        };
        return map[a.names[0]] - map[b.names[0]];
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './app/assets',
        to: 'assets'
      }
    ])
  ]
};

if (env != 'local') {
  webpackConfig.output.filename = '[name].[chunkhash].bundle.js';
}

if (env == 'prod') {
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
