/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const packageJSON = require('./package.json');
const config = require('./frontend/config.js');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const RUN_ANALYZER = !!process.env.ANALYZER;

const excludeVendorModules = [
  'regenerator-runtime',
  'fluent',
  'fluent-langneg',
  'fluent-react',
  'cldr-core'
];

const includeVendorModules = [
  'regenerator-runtime/runtime',
  'fluent/compat',
  'fluent-langneg/compat',
  'fluent-react/compat',
  'cldr-core/supplemental/likelySubtags.json',
  'html-react-parser/lib/dom-to-react',
  'react/lib/ReactDOMFactories',
  'querystring'
];

const vendorModules = Object.keys(packageJSON.dependencies)
  .filter(name => excludeVendorModules.indexOf(name) < 0)
  .concat(includeVendorModules);

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'dev'}"`,
    'process.env.ENABLE_DEV_LOCALES': process.env.ENABLE_DEV_LOCALE || 0,
    'process.env.ENABLE_DEV_CONTENT': process.env.ENABLE_DEV_CONTENT || 0
  }),
  // Include only moment locale modules that match AVAILABLE_LOCALES
  new webpack.ContextReplacementPlugin(
    /moment[\/\\]locale$/, // eslint-disable-line no-useless-escape
    new RegExp(config.AVAILABLE_LOCALES.replace(/,/g, '|'))
  ),
  new webpack.optimize.CommonsChunkPlugin('static/app/vendor.js'),
  new UglifyJSPlugin({
    parallel: true,
    sourceMap: true,
    compress: config.IS_DEBUG
  })
];

if (RUN_ANALYZER) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 9888 // Changed because extension auto-installer squats 8888
  }));
}

module.exports = {
  entry: {
    'static/app/app.js': './frontend/src/app/index.js',
    'static/app/vendor.js': vendorModules
  },
  output: {
    path: path.resolve(__dirname, 'frontend/build'),
    filename: '[name]'
  },
  node: {
    crypto: false
  },
  stats: {
    warningsFilter: warning => {
      // seedrandom has a known complaint about missing optional crypto dep
      if (warning.includes('seedrandom.js') &&
          warning.includes('crypto')) { return true; }
      // UglifyJs reports a lot of un-actionable warnings from vendor modules
      if (warning.includes('static/app/vendor.js from UglifyJs')) { return true; }
      return false;
    }
  },
  devServer: {
    contentBase: 'dist'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins
};
