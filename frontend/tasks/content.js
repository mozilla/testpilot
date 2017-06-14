const gulp = require('gulp');
const config = require('../config.js');

const fs = require('fs');
const isArray = require('util').isArray;
const mkdirp = require('mkdirp');
const through = require('through2');
const gutil = require('gulp-util');
const YAML = require('yamljs');

const util = require('./util');

const NEWS_UPDATES_YAML = config.CONTENT_SRC_PATH + 'news_updates.yaml'

gulp.task('content-build', ['content-experiments-data']);

gulp.task('content-watch', () =>
  gulp.watch(config.CONTENT_SRC_PATH + '/**/*.yaml', [
    'content-experiments-data',
    'content-extract-experiment-strings'
  ]));

gulp.task('content-experiments-data', () =>
  gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentsData())
    .pipe(gulp.dest(config.DEST_PATH)));

gulp.task('content-extract-strings', ['content-extract-experiment-strings']);

gulp.task('content-extract-experiment-strings', () =>
  gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentsFTL())
    .pipe(gulp.dest('./locales/en-US')));

function buildExperimentsFTL() {
  const strings = [];
  let newsUpdates = loadGeneralNewsUpdates();

  function collectEntry(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);

    if (!experiment.dev) {
      findLocalizableStrings(experiment);
    }

    if (experiment.news_updates) {
      newsUpdates = newsUpdates.concat(extractNewsUpdatesFromExperiment(experiment));
      delete experiment.news_updates;
    }

    return cb();
  }

  function endStream(cb) {
    newsUpdates = excludeDevOnlyNewsUpdates(newsUpdates);
    extractNewsUpdateStrings();
    this.push(new gutil.File({
      path: 'experiments.ftl',
      contents: new Buffer(generateFTL())
    }));
    cb();
  }

  function extractNewsUpdateStrings() {
    // Extract FTL strings for news updates
    const newsUpdateL10nFields = ['title', 'content'];
    newsUpdates.forEach(update => {
      newsUpdateL10nFields.forEach(fieldName => {
        strings.push({
          key: util.newsUpdateL10nId(update, fieldName),
          value: update[fieldName]
        });
      });
    });
  }

  function findLocalizableStrings(obj, pieces = [], experiment = null) {
    if (!experiment) {
      experiment = obj;
    }
    if (isArray(obj)) {
      obj.forEach((item, index) => {
        findLocalizableStrings(item, [].concat(pieces, index), experiment);
      });
    } else if (typeof obj === 'object') {
      for (var key in obj) {
        findLocalizableStrings(obj[key], [].concat(pieces, key), experiment);
      }
    } else if (obj && typeof obj === 'string' && util.isLocalizableField(pieces)) {
      strings.push({
        key: util.experimentL10nId(experiment, pieces, pieces.join('.')),
        value: obj
      });
    }
  }

  function generateFTL() {
    return strings.reduce((a, b) => {
      const value = b.value.replace(/\r?\n|\r/g, '').replace(/\s+/g, ' ');
      return `${a}\n${b.key} = ${value}`;
    }, '');
  }

  return through.obj(collectEntry, endStream);
}

function buildExperimentsData() {
  const index = {results: []};
  const counts = {};
  const cssStrings = [];
  let newsUpdates = loadGeneralNewsUpdates();

  function collectEntry(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);

    if (experiment.dev && !config.ENABLE_DEV_CONTENT) {
      // Exclude dev content if it's not enabled in config
      return cb();
    }

    if (experiment.news_updates) {
      newsUpdates = newsUpdates.concat(extractNewsUpdatesFromExperiment(experiment));
      delete experiment.news_updates;
    }

    cssStrings.push(`
.experiment-icon-wrapper-${experiment.slug} {
  background-color: ${experiment.gradient_start};
  background-image: linear-gradient(135deg, ${experiment.gradient_start}, ${experiment.gradient_stop});
}

.experiment-icon-${experiment.slug} {
  background-image: url(${experiment.thumbnail});
}
`);

    // Auto-generate some derivative API values expected by the frontend.
    Object.assign(experiment, {
      url: `/api/experiments/${experiment.id}.json`,
      html_url: `/experiments/${experiment.slug}`,
      survey_url: `https://qsurvey.mozilla.com/s3/${experiment.slug}`
    });

    counts[experiment.addon_id] = experiment.installation_count;
    delete experiment.installation_count;

    this.push(new gutil.File({
      path: `experiments/${experiment.id}.json`,
      contents: new Buffer(JSON.stringify(experiment, null, 2))
    }));

    index.results.push(experiment);

    cb();
  }

  function endStream(cb) {
    newsUpdates = excludeDevOnlyNewsUpdates(newsUpdates);
    this.push(new gutil.File({
      path: 'api/news_updates.json',
      contents: new Buffer(JSON.stringify(newsUpdates, null, 2))
    }));

    // These files are being consumed by 3rd parties (at a minimum, the Mozilla
    // Measurements Team).  Before changing them, please consult with the
    // appropriate folks!
    this.push(new gutil.File({
      path: 'api/experiments.json',
      contents: new Buffer(JSON.stringify(index, null, 2))
    }));
    this.push(new gutil.File({
      path: 'api/experiments/usage_counts.json',
      contents: new Buffer(JSON.stringify(counts, null, 2))
    }));
    this.push(new gutil.File({
      path: 'static/styles/experiments.css',
      contents: new Buffer(cssStrings.join('\n'))
    }));
    cb();
  }

  return through.obj(collectEntry, endStream);
}

// Load the initial set of general news updates not attached to any experiment
function loadGeneralNewsUpdates() {
  const newsUpdatesData = fs.readFileSync(NEWS_UPDATES_YAML).toString('utf-8');
  return YAML.parse(newsUpdatesData) || [];
}

// Extract news updates from experiment, annotate each update with slug.
function extractNewsUpdatesFromExperiment(experiment) {
  const { news_updates, slug } = experiment;
  return news_updates.map(update => ({
    ...update, experimentSlug: slug
  }));
}

// Final pass through news updates to exclude dev-only content
function excludeDevOnlyNewsUpdates(newsUpdates) {
  return newsUpdates.filter(update => config.ENABLE_DEV_CONTENT || !update.dev);
}
