const gulp = require('gulp');
const config = require('../config.js');

const fs = require('fs');
const isArray = require('util').isArray;
const mkdirp = require('mkdirp');
const through = require('through2');
const gutil = require('gulp-util');
const YAML = require('yamljs');

const util = require('./util');

gulp.task('content-build', ['content-experiments-data']);

gulp.task('content-watch', () => {
  gulp.watch(config.CONTENT_SRC_PATH + '/**/*.yaml', [
    'content-experiments-data',
    'content-extract-experiment-strings'
  ]);
});

gulp.task('content-experiments-data', function generateStaticAPITask() {
  return gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentsData())
    .pipe(gulp.dest(config.DEST_PATH));
});

gulp.task('content-extract-strings', ['content-extract-experiment-strings']);

gulp.task('content-extract-experiment-strings', () =>
  gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentsFTL())
    .pipe(gulp.dest('./locales/en-US')));

function buildExperimentsFTL() {
  const strings = [];

  function collectEntry(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);

    if (!experiment.dev) {
      findLocalizableStrings(experiment);
    }

    return cb();
  }

  function endStream(cb) {
    this.push(new gutil.File({
      path: 'experiments.ftl',
      contents: new Buffer(generateFTL())
    }));
    cb();
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

  function collectEntry(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);

    if (experiment.dev && !config.ENABLE_DEV_CONTENT) {
      // Exclude dev content if it's not enabled in config
      return cb();
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
