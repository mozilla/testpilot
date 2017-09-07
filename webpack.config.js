/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const packageJSON = require('./package.json');
const config = require('./frontend/config.js');

const excludeVendorModules = [
  'babel-polyfill',
  'fluent',
  'fluent-langneg',
  'fluent-react',
  'cldr-core'
];

const includeVendorModules = [
  'babel-polyfill/browser',
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

module.exports = {
  entry: {
    'static/app/app.js': './frontend/src/app/index.js',
    'static/app/vendor.js': vendorModules
  },
  output: {
    path: path.resolve(__dirname, 'frontend/build'),
    filename: '[name]'
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'dev'}"`,
      'process.env.ENABLE_DEV_LOCALES': process.env.ENABLE_DEV_LOCALE || 0,
      'process.env.ENABLE_DEV_CONTENT': process.env.ENABLE_DEV_CONTENT || 0
    }),
    new webpack.optimize.CommonsChunkPlugin('static/app/vendor.js'),
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
      compress: config.IS_DEBUG
    })
  ]
};
