var WebpackConfig = require('webpack-config'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
    StringReplacePlugin = require('string-replace-webpack-plugin');

var arg = process.argv[3];
var singleRun = false;
if (arg === '--singleRun'){
  singleRun = true;
}

// Karma configuration
// Generated on Wed Dec 30 2015 11:13:38 GMT-0500 (EST)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    files: [
      {
        pattern: 'app/test.index.ts',
        watched: false,
        included: true,
        served: true
      }
    ],

    mime: {
      'text/x-typescript': ['ts','tsx']
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files to exclude
    exclude: [
      'node_modules'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'dots', 'coverage', 'remap-coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: singleRun,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    preprocessors: {
      'app/test.index.ts': ['webpack', 'sourcemap']
    },

    webpack: (function() {
      var config = new WebpackConfig().extend("webpack.config");
      config.plugins = [
        new ngAnnotatePlugin({add: true}),
        new StringReplacePlugin()
      ];
      config.watch = true;
      return config;
    })(),

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-remap-coverage'),
      require('karma-sourcemap-loader')
    ],

    coverageReporter: {
      type: 'in-memory'
    },
    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    }
  });
};
