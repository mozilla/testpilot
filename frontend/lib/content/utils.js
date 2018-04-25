const config = require("../../config.js");

exports.extractNewsUpdates = (experiments, news_updates) =>
  experiments
    .filter(item => config.ENABLE_DEV_CONTENT || !item.parsed.dev)
    .reduce(
      (acc, { parsed: experiment }) =>
        acc.concat(
          (experiment.news_updates || []).map(update => ({
            ...update,
            experimentSlug: experiment.slug
          }))
        ),
      news_updates[0].parsed
    )
    .filter(update => config.ENABLE_DEV_CONTENT || !update.dev);
