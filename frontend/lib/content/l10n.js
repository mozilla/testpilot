const { isArray } = require("util");

const config = require("../../config.js");

const util = require("../../tasks/util");
const { extractNewsUpdates } = require("./utils");

const newsUpdateL10nFields = ["title", "content"];

// Note: This transform function wants basePaths configured, so it's exported
// as a transform function factory rather than a bare transform.
module.exports = basePaths => ({
  inputs: { experiments: experimentsIn, news_updates }
}) => {
  // Filter out dev experiments - we never want to extract strings for those
  const experiments = experimentsIn.filter(item => !item.parsed.dev);

  const experimentsStrings = [];
  experiments.forEach(({ parsed: experiment }) =>
    findLocalizableStrings(experimentsStrings, experiment)
  );

  const newsUpdatesStrings = [];
  extractNewsUpdates(experiments, news_updates).forEach(update => {
    newsUpdateL10nFields.forEach(fieldName => {
      newsUpdatesStrings.push({
        key: util.newsUpdateL10nId(update, fieldName),
        value: update[fieldName]
      });
    });
  });

  const allStrings = experimentsStrings.concat(newsUpdatesStrings);
  const ftl = generateFTL(allStrings);
  const out = {};
  basePaths.forEach(
    basePath => (out[`${basePath}/locales/en-US/experiments.ftl`] = ftl)
  );
  return out;
};

function generateFTL(strings) {
  return strings.reduce((a, b) => {
    const value = b.value.replace(/\r?\n|\r/g, "").replace(/\s+/g, " ");
    return `${a}\n${b.key} = ${value}`;
  }, "");
}

function findLocalizableStrings(strings, obj, pieces = [], experiment = null) {
  if (!experiment) {
    experiment = obj;
  }
  if (isArray(obj)) {
    obj.forEach((item, index) => {
      findLocalizableStrings(
        strings,
        item,
        [].concat(pieces, index),
        experiment
      );
    });
  } else if (typeof obj === "object") {
    for (var key in obj) {
      findLocalizableStrings(
        strings,
        obj[key],
        [].concat(pieces, key),
        experiment
      );
    }
  } else if (
    obj &&
    typeof obj === "string" &&
    util.isLocalizableField(pieces)
  ) {
    strings.push({
      key: util.experimentL10nId(experiment, pieces, pieces.join(".")),
      value: obj
    });
  }
}
