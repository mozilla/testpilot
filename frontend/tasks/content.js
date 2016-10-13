const gulp = require('gulp');
const config = require('../config.js');

const fs = require('fs');
const mkdirp = require('mkdirp');
const through = require('through2');
const gutil = require('gulp-util');
const YAML = require('yamljs');

gulp.task('content-build', ['content-experiments-json']);

gulp.task('content-watch', () => {
  gulp.watch(config.CONTENT_SRC_PATH + '/**/*.yaml', ['content-experiments-json']);
});

gulp.task('content-experiments-json', function generateStaticAPITask() {
  return gulp.src(config.CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentsJSON())
    .pipe(gulp.dest(config.DEST_PATH + 'api'));
});

gulp.task('import-api-content', (done) => {
  fetch(config.PRODUCTION_EXPERIMENTS_URL)
    .then(response => response.json())
    .then(data => Promise.all(data.results.map(processImportedExperiment)))
    .then(() => done())
    .catch(done);
});

function buildExperimentsJSON() {
  const index = {results: []};
  const counts = {};

  function collectEntry(file, enc, cb) {
    const yamlData = file.contents.toString();
    const experiment = YAML.parse(yamlData);

    // Auto-generate some derivative API values expected by the frontend.
    Object.assign(experiment, {
      url: `/api/experiments/${experiment.id}.json`,
      html_url: `/experiments/${experiment.slug}`,
      installations_url: `/api/experiments/${experiment.id}/installations/`,
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
      path: 'experiments.json',
      contents: new Buffer(JSON.stringify(index, null, 2))
    }));
    this.push(new gutil.File({
      path: 'experiments/usage_counts.json',
      contents: new Buffer(JSON.stringify(counts, null, 2))
    }));
    cb();
  }

  return through.obj(collectEntry, endStream);
}

function processImportedExperiment(experiment) {
  // Clean up auto-generated and unused model fields.
  const fieldsToDelete = {
    '': ['url', 'html_url', 'installations_url', 'survey_url'],
    details: ['order', 'url', 'experiment_url'],
    tour_steps: ['order', 'experiment_url'],
    contributors: ['username']
  };
  Object.keys(fieldsToDelete).forEach(key => {
    const items = (key === '') ? [experiment] : experiment[key];
    const fields = fieldsToDelete[key];
    items.forEach(item => fields.forEach(field => delete item[field]));
  });

  // Download all the images associated with the experiment.
  const imageFields = {
    '': ['thumbnail', 'image_twitter', 'image_facebook'],
    details: ['image'],
    tour_steps: ['image'],
    contributors: ['avatar']
  };
  const toDownload = [];
  Object.keys(imageFields).forEach(key => {
    const items = (key === '') ? [experiment] : experiment[key];
    const fields = imageFields[key];
    items.forEach(item => fields.forEach(field => {
      // Grab the original image URL, bail if it's not available
      const origURL = item[field];
      if (!origURL) { return; }

      // Chop off the protocol & domain, convert gravatar param to .jpg
      const path = origURL.split('/').slice(3).join('/').replace('?s=64', '.jpg');

      // Now build a new file path and URL for the image
      const newPath = `${config.IMAGE_NEW_BASE_PATH}${experiment.slug}/${path}`;
      const newURL = `${config.IMAGE_NEW_BASE_URL}${experiment.slug}/${path}`;

      // Replace the old URL with new static URL
      item[field] = newURL;

      // Schedule the old URL for download at the new path.
      toDownload.push({url: origURL, path: newPath});
    }));
  });

  // Download all the images, then write the YAML.
  return Promise.all(toDownload.map(downloadURL))
    .then(() => writeExperimentYAML(experiment));
}

// Write file contents after first ensuring the parent directory exists.
function writeFile(path, content) {
  const parentDir = path.split('/').slice(0, -1).join('/');
  return new Promise((resolve, reject) => {
    mkdirp(parentDir, dirErr => {
      if (dirErr) { return reject(dirErr); }
      fs.writeFile(path, content, err => err ? reject(err) : resolve(path));
    });
  });
}

function downloadURL(item) {
  const {url, path} = item;
  return fetch(url)
    .then(res => res.buffer())
    .then(resBuffer => writeFile(path, resBuffer))
    .then(() => {
      if (config.IS_DEBUG) { console.log('Downloaded', url, 'to', path); }
    });
}

function writeExperimentYAML(experiment) {
  const out = YAML.stringify(experiment, 4, 2);
  const path = `${config.CONTENT_SRC_PATH}experiments/${experiment.slug}.yaml`;
  if (config.IS_DEBUG) { console.log(`Generated ${path}`); }
  return writeFile(path, out);
}
