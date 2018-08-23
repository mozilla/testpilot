/* eslint-disable import/no-extraneous-dependencies */

const path = require("path");
const webpack = require("webpack");
const morgan = require("morgan");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const ContentPlugin = require("./frontend/lib/content");

const {
  DevServerMiddleware,
  DevServerHTTPSOptions
} = require("./frontend/lib/dev-server");

const config = require("./frontend/config.js");

const {
  NODE_ENV = "development",
  ENABLE_DEV_LOCALE = 0,
  ENABLE_DEV_CONTENT = 0
} = process.env;

module.exports = {
  mode: NODE_ENV === "development" ? "development" : "production",
  entry: {
    "static/app/app": "./frontend/src/app/index.js",
    "static/scripts/legal": "./frontend/src/scripts/legal.js",
    "static/scripts/locale": "./frontend/src/scripts/locale.js"
  },
  output: {
    path: path.resolve(__dirname, "frontend/build"),
    filename: "[name].js"
  },
  watchOptions: {
    poll: 1000
  },
  node: {
    fs: "empty",
    crypto: false
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
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": `"${NODE_ENV}"`,
      "process.env.ENABLE_DEV_LOCALES": ENABLE_DEV_LOCALE,
      "process.env.ENABLE_DEV_CONTENT": ENABLE_DEV_CONTENT
    }),
    new CopyWebpackPlugin([
      { from: "./addon/*.xpi", to: "static/" },
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
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              publicPath: "/static/app/images/",
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
  }
};
