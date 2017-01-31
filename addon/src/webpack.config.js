/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const path = require('path');
const webpack = require('webpack');

const config = {
  entry: [ path.join(__dirname, 'main.js') ],
  output: {
    path: path.join(__dirname, '..', 'data'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [ [ 'es2015', { modules: false } ], 'stage-2' ],
          plugins: [ 'transform-flow-strip-types' ]
        },
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  externals: [ /^sdk|chrome|resource/ ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      global: {}
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ]
};

module.exports = config;
