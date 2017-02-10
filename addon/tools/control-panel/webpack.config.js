/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const path = require('path');

module.exports = {
  entry: [path.join(__dirname, 'main.js')],
  output: { path: path.join(__dirname, '..'), filename: 'control-panel.js' },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2'],
          plugins: ['transform-flow-strip-types']
        },
        exclude: /node_modules/,
        include: [__dirname, path.join(__dirname, '..', '..', 'src', 'lib')]
      }
    ]
  }
};
