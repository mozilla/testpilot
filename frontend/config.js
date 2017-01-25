const fs = require('fs');

module.exports = {
  SERVER_PORT: 8000,
  IS_DEBUG: (process.env.NODE_ENV === 'development'),
  USE_HTTPS: (process.env.USE_HTTPS != 0),
  ENABLE_PONTOON: (process.env.ENABLE_PONTOON === '1'),
  ENABLE_DEV_CONTENT: (process.env.ENABLE_DEV_CONTENT === '1'),
  AVAILABLE_LOCALES: (process.env.ENABLE_DEV_LOCALES === '1') ?
    // All locales on Pontoon for local & dev
    // en is copied from en-US at build time, so we have to add it special
    'en,' + fs.readdirSync('./locales').join(',')  :
    // Enabled locales for stage & production - update as they reach 100%
    'en-US,en,cs,de,dsb,es-ES,fr,fy-NL,hsb,hu,it,ja,kab,nl,pt-BR,ru,sv-SE,uk,zh-CN,zh-TW',

  // TODO: Move addon build to a better path
  ADDON_SRC_PATH: './addon/',

  SRC_PATH: './frontend/src/',
  DEST_PATH: './frontend/build/',
  DIST_PATH: './dist/',
  DJANGO_OLD_STATIC:  './testpilot/frontend/static/',
  CONTENT_SRC_PATH: './content-src/',

  PRODUCTION_EXPERIMENTS_URL: 'https://testpilot.firefox.com/api/experiments',
  IMAGE_NEW_BASE_PATH: 'frontend/src/images/experiments/',
  IMAGE_NEW_BASE_URL: '/static/images/experiments/',

  'sass-lint': true,
  'js-lint': true
};

// Pull in local debug-config.json overrides
const tryRequire = require('try-require');
Object.assign(module.exports, tryRequire('../debug-config.json') || {});
