require('es6-promise').polyfill();
require('isomorphic-fetch');

const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
// const cache = require('gulp-cache');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
// const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const minifycss = require('gulp-cssnano');
const multiDest = require('gulp-multi-dest');
const normalize = require('node-normalize-scss');
const rename = require('gulp-rename');
const RevAll = require('gulp-rev-all');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const through = require('through2');
const uglify = require('gulp-uglify');
const tryRequire = require('try-require');
const Remarkable = require('remarkable');
const md = new Remarkable({
  html: true
});
const YAML = require('yamljs');
const fs = require('fs');
const mkdirp = require('mkdirp');

const IS_DEBUG = (process.env.NODE_ENV === 'development');

const SRC_PATH = './testpilot/frontend/static-src/';
const DEST_PATH = './testpilot/frontend/static/';
const STAGE_PATH = './stage/';
const DIST_PATH = './dist/';

const CONTENT_SRC_PATH = 'content-src/';
const PRODUCTION_EXPERIMENTS_URL = 'https://testpilot.firefox.com/api/experiments';
const IMAGE_NEW_BASE_PATH = 'testpilot/frontend/static-src/images/experiments/';
const IMAGE_NEW_BASE_URL = '/static/images/experiments/';

const config = tryRequire('./debug-config.json') || {
  'sass-lint': true,
  'js-lint': true
};

const excludeVendorModules = [
  'babel-polyfill',
  'l20n'
];
const includeVendorModules = [
  'babel-polyfill/browser',
  'l20n/dist/compat/web/l20n'
];
const packageJSON = require('./package.json');
const vendorModules = Object.keys(packageJSON.dependencies)
  .filter(name => excludeVendorModules.indexOf(name) < 0)
  .concat(includeVendorModules);

function shouldLint(opt, task) {
  return config[opt] ? [task] : [];
}

function lintTask() {
  return gulp.src(['*.js', SRC_PATH + '{app,test}/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

gulp.task('lint', lintTask);

// Lint the gulpfile
gulp.task('selfie', function selfieTask() {
  return gulp.src('gulpfile.js')
    .pipe(lintTask());
});

gulp.task('clean', function cleanTask() {
  return del([
    DEST_PATH,
    STAGE_PATH,
    DIST_PATH
  ]);
});

const legalTemplates = require('./legal-copy/legal-templates');

function convertToLegalPage() {
  return through.obj(function legalConvert(file, encoding, callback) {
    file.contents = new Buffer(`${legalTemplates.templateBegin}
                                ${md.render(file.contents.toString())}
                                ${legalTemplates.templateEnd}`);
    file.path = gutil.replaceExtension(file.path, '.html');
    this.push(file);
    callback();
  });
}

gulp.task('legal', function legalTask() {
  return gulp.src('./legal-copy/*.md')
             .pipe(convertToLegalPage())
             .pipe(gulp.dest('./legal-copy/'));
});

gulp.task('app-main', function appMainTask() {
  return commonBrowserify('app.js', browserify({
    entries: [SRC_PATH + 'app/main.js'],
    debug: IS_DEBUG,
    fullPaths: IS_DEBUG,
    transform: [babelify]
  }).external(vendorModules));
});

gulp.task('app-vendor', function appVendorTask() {
  return commonBrowserify('vendor.js', browserify({
    debug: IS_DEBUG
  }).require(vendorModules));
});

function commonBrowserify(sourceName, b) {
  return b
    .bundle()
    .pipe(source(sourceName))
    .pipe(buffer())
    .pipe(gulpif(IS_DEBUG, sourcemaps.init({loadMaps: true})))
     // don't uglify in development. eases build chain debugging
    .pipe(gulpif(!IS_DEBUG, uglify()))
    .on('error', gutil.log)
    .pipe(gulpif(IS_DEBUG, sourcemaps.write('./')))
    .pipe(gulp.dest(DEST_PATH + 'app/'));
}

gulp.task('scripts', shouldLint('js-lint', 'lint'), function extraScriptsTask() {
  return gulp.src(SRC_PATH + 'scripts/**/*')
    .pipe(gulpif(IS_DEBUG, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(!IS_DEBUG, uglify()))
    .pipe(gulpif(IS_DEBUG, sourcemaps.write('./')))
    .pipe(gulp.dest(DEST_PATH + 'scripts'));
});

gulp.task('styles', shouldLint('sass-lint', 'sass-lint'), function stylesTask() {
  return gulp.src(SRC_PATH + 'styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        normalize.includePaths
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
      // don't minify in development
      .pipe(gulpif(!IS_DEBUG, minifycss()))
      .pipe(gulpif(IS_DEBUG, sourcemaps.write('.')))
    .pipe(gulp.dest(DEST_PATH + 'styles'));
});

// the globbing pattern here should be cleaned up
// when node-sass supports inline ignores
// see the note in the _hidpi-mixin for details
gulp.task('sass-lint', function sassLintTask() {
  const files = [
    SRC_PATH + '/styles/**/*.scss',
    '!' + SRC_PATH + '/styles/_hidpi-mixin.scss'
  ];
  return gulp.src(files)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('images', function imagesTask() {
  return gulp.src(SRC_PATH + 'images/**/*')
    // imagemin skips files https://github.com/sindresorhus/gulp-imagemin/issues/183
    // files have been optimized and rechecked into the repo
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST_PATH + 'images'));
});

gulp.task('locales', function localesTask() {
  return gulp.src('./locales/**/*')
    .pipe(gulp.dest(DEST_PATH + 'locales'));
});

gulp.task('addon', function localesTask() {
  return gulp.src(SRC_PATH + 'addon/**/*')
    .pipe(gulp.dest(DEST_PATH + 'addon'));
});

gulp.task('import-api-content', function importContentTask(done) {
  fetch(PRODUCTION_EXPERIMENTS_URL)
    .then(response => response.json())
    .then(data => Promise.all(data.results.map(processImportedExperiment)))
    .then(() => done())
    .catch(done);
});

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
      const newPath = `${IMAGE_NEW_BASE_PATH}${experiment.slug}/${path}`;
      const newURL = `${IMAGE_NEW_BASE_URL}${experiment.slug}/${path}`;

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
      if (IS_DEBUG) { console.log('Downloaded', url, 'to', path); }
    });
}

function writeExperimentYAML(experiment) {
  const out = YAML.stringify(experiment, 4, 2);
  const path = `${CONTENT_SRC_PATH}experiments/${experiment.slug}.yaml`;
  if (IS_DEBUG) { console.log(`Generated ${path}`); }
  return writeFile(path, out);
}

gulp.task('experiments-json', function generateStaticAPITask() {
  return gulp.src(CONTENT_SRC_PATH + 'experiments/*.yaml')
    .pipe(buildExperimentsJSON('experiments'))
    .pipe(gulp.dest(DEST_PATH + 'api'));
});

function buildExperimentsJSON(path) {
  const index = {results: []};

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

    this.push(new gutil.File({
      path: `${path}/${experiment.id}.json`,
      contents: new Buffer(JSON.stringify(experiment, null, 2))
    }));

    index.results.push(experiment);
    cb();
  }

  function endStream(cb) {
    this.push(new gutil.File({
      path: `${path}.json`,
      contents: new Buffer(JSON.stringify(index, null, 2))
    }));
    cb();
  }

  return through.obj(collectEntry, endStream);
}

gulp.task('stage-assets', function() {
  return gulp.src(DEST_PATH + '**')
      .pipe(gulp.dest(STAGE_PATH + 'static'));
});

gulp.task('move-api', function() {
  return new Promise((resolve, reject) => {
    gulp.src(STAGE_PATH + 'static/api/**', { base: STAGE_PATH + 'static' })
    .pipe(gulp.dest(STAGE_PATH))
    .on('end', () => {
      del(STAGE_PATH + 'static/api').then(resolve).catch(reject);
    });
  });
});

gulp.task('copy-html', function() {
  const paths = fs.readdirSync(CONTENT_SRC_PATH + 'experiments')
    .map(f => `${STAGE_PATH}experiments/${f.replace('.yaml', '')}`)
    .concat([
      STAGE_PATH,
      STAGE_PATH + 'experiments',
      STAGE_PATH + 'onboarding',
      STAGE_PATH + 'home',
      STAGE_PATH + 'share',
      STAGE_PATH + 'legacy',
      STAGE_PATH + 'error'
    ]);
  return merge(
    gulp.src(SRC_PATH + 'index.html')
      .pipe(multiDest(paths)),
    gulp.src('./legal-copy/privacy-notice.html')
      .pipe(rename('index.html'))
      .pipe(gulp.dest(STAGE_PATH + '/privacy')),
    gulp.src('./legal-copy/terms-of-use.html')
      .pipe(rename('index.html'))
      .pipe(gulp.dest(STAGE_PATH + '/terms'))
  );
});

gulp.task('rev-assets', function() {
  const revAll = new RevAll({
    dontRenameFile: [
      '.json',
      'favicon.ico',
      /static\/addon\/*/,
      /static\/locales\/*/,
      '.html'
    ],
    dontUpdateReference: [
      /.*\.json/,
      'favicon.ico'
    ]
  });
  return gulp.src(STAGE_PATH + '**')
    .pipe(revAll.revision())
    .pipe(gulp.dest(DIST_PATH));
});

gulp.task('clean-stage', function() {
  return del(STAGE_PATH);
});

gulp.task('static', function staticTask(done) {
  return runSequence(
    'build',
    'stage-assets',
    'move-api',
    'copy-html',
    'rev-assets',
    'clean-stage',
    done
  );
});

gulp.task('build', function buildTask(done) {
  return runSequence(
    'clean',
    'app-vendor',
    'app-main',
    'scripts',
    'styles',
    'images',
    'locales',
    'addon',
    'legal',
    'experiments-json',
    done
  );
});

gulp.task('watch', function watchTask() {
  gulp.watch(SRC_PATH + 'styles/**/*', ['styles']);
  gulp.watch(SRC_PATH + 'images/**/*', ['images']);
  gulp.watch(SRC_PATH + 'app/**/*.js', ['app-main']);
  gulp.watch('./package.json', ['app-vendor']);
  gulp.watch(SRC_PATH + 'scripts/**/*.js', ['scripts']);
  gulp.watch(SRC_PATH + 'addon/**/*', ['addon']);
  gulp.watch(['./legal-copy/*.md', './legal-copy/*.js'], ['legal']);
  gulp.watch('./locales/**/*', ['locales']);
  gulp.watch(CONTENT_SRC_PATH + '/*.yaml', ['experiments-json']);
  gulp.watch('gulpfile.js', () => process.exit());
});

let serverPort = 8000;

// Set up a webserver for the static assets
gulp.task('connect', function connectTask() {
  connect.server({
    root: DIST_PATH,
    livereload: false,
    port: serverPort
  });
});

gulp.task('server', function() {
  serverPort = 9988;
  return runSequence(
    'static',
    'connect',
    'watch'
  );
});

gulp.task('static-only-server', function() {
  return runSequence(
    'static',
    'connect',
    'watch'
  );
});

gulp.task('default', ['build', 'watch']);
