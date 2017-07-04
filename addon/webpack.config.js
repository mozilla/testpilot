/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable import/no-extraneous-dependencies, global-require */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { exec, mkdir, cp } = require('shelljs');

const AfterBuildPlugin = require('./lib/webpack-after-build');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ThrowErrorPlugin = require('./lib/webpack-error');

const WATCH_MODE = process.argv.includes('--watch');

const baseConfig = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // Minimal babel transforms - Firefox supports many ES2015 features
          babelrc: false,
          presets: ['react'],
          plugins: []
        }
      }
    ]
  },
  plugins: [
    new ThrowErrorPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'dev'}"`
    }),
    // Package add-on when finished with build.
    // TODO: Replace with sign-addon?
    new AfterBuildPlugin(() => {
      mkdir('-p', 'dist');
      // HACK: Only perform bundling if the second half of build has been
      // performed, but we still want to rebuild & post the first half on file
      // watching.
      const buildPackagePath = './build/package.json';
      if (fs.existsSync(buildPackagePath)) {
        const frontendConfig = require('../frontend/config');
        const locales = frontendConfig.AVAILABLE_LOCALES;
        const env = Object.assign({}, process.env, {
          SUPPORTED_LOCALES: locales
        });
        exec('node bin/update-version');
        exec(
          'node ./node_modules/.bin/pontoon-to-webext ' +
            '--src ../locales --dest ./build/webextension/_locales',
          { env }
        );
        if (WATCH_MODE) {
          exec('jpm post --addon-dir=build --post-url http://localhost:8888/');
        } else {
          const packageData = require(buildPackagePath);
          exec('jpm xpi --addon-dir=build --dest-dir=dist');
          cp('./dist/testpilot-addon.xpi', './addon.xpi');
          cp(
            `./dist/@testpilot-addon-${packageData.version}.update.rdf`,
            './update.rdf'
          );
        }
      }
    })
  ]
};

module.exports = [
  // HACK: bootstrap.js needs to globally export startup & shutdown
  Object.assign({}, baseConfig, {
    entry: { bootstrap: './src/bootstrap.js' },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      library: '{ startup, shutdown }',
      libraryTarget: 'var'
    }
  }),
  // The rest of the JS can get bundled like usual
  Object.assign({}, baseConfig, {
    entry: {
      'chrome/scripts/frame-script': './src/chrome/scripts/frame-script.js',
      'webextension/background': './src/webextension/background.js',
      'webextension/survey-popup/index':
        './src/webextension/survey-popup/index.js'
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'LICENSE' },
        { from: './src/install.rdf' },
        { from: './package.json' },
        { from: './src/chrome.manifest' },
        { from: './src/webextension/manifest.json', to: './webextension/' },
        { from: './src/webextension/icons', to: './webextension/icons' },
        {
          from: './src/webextension/survey-popup/index.html',
          to: './webextension/survey-popup/'
        }
      ])
    ].concat(baseConfig.plugins)
  })
];
