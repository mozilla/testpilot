#!/usr/bin/env node
const globby = require('globby');
const YAML = require("yamljs");
const ContentTransformerPlugin = require(__dirname + "/../frontend/lib/content-transformer-plugin");
const buildL10N = require(__dirname + "/../frontend/lib/content/l10n");

const contentTransformer = new ContentTransformerPlugin({
  inputs: {
    experiments: "content-src/experiments/**/*.yaml",
    news_updates: "content-src/news_updates.yaml"
  },
  parser: ({ file }) => YAML.parse(file.content.toString("utf8")),
  transforms: [ buildL10N(["."]) ]
});

contentTransformer.applyOnce('.').then(result => {
  console.log("Assets output:");
  Object.keys(result).forEach(key => console.log("\t", key));
});
