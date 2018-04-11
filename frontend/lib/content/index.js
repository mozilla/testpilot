const ContentTransformerPlugin = require("../content-transformer-plugin");
const YAML = require("yamljs");

module.exports = () =>
  new ContentTransformerPlugin({
    inputs: {
      experiments: "content-src/experiments/**/*.yaml",
      news_updates: "content-src/news_updates.yaml"
    },
    parser: ({ file }) => YAML.parse(file.content.toString("utf8")),
    transforms: [
      require("./l10n")(["static", "../.."]),
      require("./feeds"),
      require("./css"),
      require("./json")
    ]
  });
