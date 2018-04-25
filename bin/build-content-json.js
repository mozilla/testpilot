#!/usr/bin/env node
const globby = require('globby');
const YAML = require("yamljs");
const ContentTransformerPlugin = require(__dirname + "/../frontend/lib/content-transformer-plugin");
const buildJSON = require(__dirname + "/../frontend/lib/content/json");

const contentTransformer = new ContentTransformerPlugin({
  inputs: {
    experiments: "content-src/experiments/**/*.yaml",
    news_updates: "content-src/news_updates.yaml"
  },
  parser: ({ file }) => YAML.parse(file.content.toString("utf8")),
  transforms: [ buildJSON ]
});

contentTransformer.applyOnce('frontend/build').then(result => {
  console.log("Assets output:");
  Object.keys(result).forEach(key => console.log("\t", key));
});

