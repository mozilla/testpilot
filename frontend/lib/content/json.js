const config = require("../../config.js");
const { extractNewsUpdates } = require("./utils");

module.exports = ({ inputs: { experiments, news_updates } }) => {
  const newsUpdates = extractNewsUpdates(experiments, news_updates);
  const out = { "api/news_updates.json": newsUpdates };

  const results = experiments
    .filter(item => config.ENABLE_DEV_CONTENT || !item.parsed.dev)
    .map(({ modified, parsed }) => {
      // Shallow clone of the parsed object, because we're going to modify it.
      const experiment = { ...parsed };
      const { id, slug } = experiment;
      Object.assign(experiment, {
        url: `/api/experiments/${id}.json`,
        html_url: `/experiments/${slug}`,
        survey_url: `https://qsurvey.mozilla.com/s3/${slug}`
      });
      delete experiment.news_updates;
      if (modified) {
        out[`api/experiments/${id}.json`] = experiment;
      }
      return experiment;
    });

  out["api/experiments.json"] = { results };

  return out;
};
