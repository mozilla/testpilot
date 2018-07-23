/* eslint-disable import/no-extraneous-dependencies */

const path = require("path");
const webpack = require("webpack");
const morgan = require("morgan");

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const ContentPlugin = require("./frontend/lib/content");

const {
  DevServerMiddleware,
  DevServerHTTPSOptions
} = require("./frontend/lib/dev-server");

const packageJSON = require("./package.json");
const config = require("./frontend/config.js");

const RUN_ANALYZER = !!process.env.ANALYZER;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_DEV = NODE_ENV === "development";

const excludeVendorModules = [
  "babel-polyfill",
  "fluent",
  "fluent-langneg",
  "fluent-react",
  "cldr-core"
];

const includeVendorModules = [
  "babel-polyfill/browser",
  "fluent/compat",
  "fluent-langneg/compat",
  "fluent-react/compat",
  "cldr-core/supplemental/likelySubtags.json",
  "html-react-parser/lib/dom-to-react",
  "querystring"
];

const vendorModules = Object.keys(packageJSON.dependencies)
  .filter(name => excludeVendorModules.indexOf(name) < 0)
  .concat(includeVendorModules);

const extractSass = new ExtractTextPlugin({
  // TODO: Take over filename hashing once gulp stops doing rev-assets
  // filename: "[name].[contenthash].css"
  filename: "[name].css"
});

const plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": `"${NODE_ENV}"`,
    "process.env.ENABLE_DEV_LOCALES": process.env.ENABLE_DEV_LOCALE || 0,
    "process.env.ENABLE_DEV_CONTENT": process.env.ENABLE_DEV_CONTENT || 0
  }),
  new CopyWebpackPlugin([
    { from: "./addon/*.xpi", to: "static/"},
    { context: "./locales", from: "**/*", to: "static/locales/" },
    { context: "./frontend/src/images", from: "**/*", to: "static/images/" }
  ]),
  ContentPlugin(),
  new WriteFilePlugin(),
  // Include only moment locale modules that match AVAILABLE_LOCALES
  new webpack.ContextReplacementPlugin(
    /moment[\/\\]locale$/, // eslint-disable-line no-useless-escape
    new RegExp(config.AVAILABLE_LOCALES.replace(/,/g, "|"))
  ),
  new webpack.optimize.CommonsChunkPlugin("static/app/vendor"),
  extractSass
];

if (!IS_DEV) {
  plugins.push(
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true
    })
  );
}

if (RUN_ANALYZER) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 9888 // Changed because extension auto-installer squats 8888
  }));
}

module.exports = {
  entry: {
    "static/app/app": "./frontend/src/app/index.js",
    "static/app/vendor": vendorModules,
    "static/scripts/legal": "./frontend/src/scripts/legal.js",
    "static/scripts/locale": "./frontend/src/scripts/locale.js"
  },
  output: {
    path: path.resolve(__dirname, "frontend/build"),
    // TODO: Take over filename hashing once gulp stops doing rev-assets
    // filename: "[name].[hash].js"
    filename: "[name].js"
  },
  node: {
    crypto: false
  },
  stats: {
    warningsFilter: warning => {
      // seedrandom has a known complaint about missing optional crypto dep
      if (warning.includes("seedrandom.js") &&
          warning.includes("crypto")) { return true; }
      // UglifyJs reports a lot of un-actionable warnings from vendor modules
      if (warning.includes("static/app/vendor.js from UglifyJs")) { return true; }
      return false;
    }
  },
  devServer: {
    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT || 8000,
    allowedHosts: ["example.com"],
    publicPath: "/",
    contentBase: path.join(__dirname, "frontend/build"),
    index: "index.html",
    before: app => {
      app.use(morgan("dev"));
      app.use(DevServerMiddleware);
    },
    https: { ...DevServerHTTPSOptions }
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            { loader: "css-loader" },
            { loader: "postcss-loader" },
            { loader: "sass-loader" }
          ],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              publicPath: "/",
              outputPath: "static/app/images/",
              name: "[name]-[hash].[ext]"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true
            }
          }
        ]
      }
    ]
  },
  plugins
};
