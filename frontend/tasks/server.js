const fs = require('fs');
const url = require('url');

const gulp = require('gulp');
const config = require('../config.js');

const connect = require('gulp-connect');

const pkey = fs.readFileSync('./frontend/certs/server/my-server.key.pem');
const pcert = fs.readFileSync('./frontend/certs/server/my-server.crt.pem');
const pca = fs.readFileSync('./frontend/certs/server/my-private-root-ca.crt.pem');

// HACK: CSP copied from bin/deploy.sh
const CSP = `default-src 'self'; connect-src 'self' https://sentry.prod.mozaws.net https://www.google-analytics.com https://ssl.google-analytics.com https://basket.mozilla.org https://analysis-output.telemetry.mozilla.org; font-src 'self' code.cdn.mozilla.net; form-action 'none'; frame-ancestors 'self' https://pontoon.mozilla.org; img-src 'self' https://pontoon.mozilla.org https://ssl.google-analytics.com https://www.google-analytics.com; object-src 'none'; script-src 'self' https://pontoon.mozilla.org https://ssl.google-analytics.com; style-src 'self' https://pontoon.mozilla.org code.cdn.mozilla.net; report-uri /__cspreport__; frame-src https://www.youtube.com;`;

const serverOptions = {
  root: config.DEST_PATH,
  livereload: false,
  fallback: './frontend/build/notfound/index.html',
  host: '0.0.0.0',
  port: config.SERVER_PORT,
  middleware: (connect, ops) => [
    // Rewrite /path to /path/index.html
    (req, res, next) => {
      const parsed = url.parse(req.url);
      const { pathname } = parsed;

      // If no dot and trailing slash, try rewriting
      if (pathname.indexOf('.') === -1 &&
          pathname.substring(pathname.length - 1) !== '/') {
        parsed.pathname = pathname + '/index.html';
        req.url = url.format(parsed);
      }

      if (pathname.indexOf('.json') !== -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }

      // Skip CSP for storybook
      if (pathname.indexOf('.storybook') !== -1) { return next(); }

      // Rewrite /static/addon/latest to /static/addon/addon.xpi
      if (pathname === '/static/addon/latest') {
        parsed.pathname = '/static/addon/addon.xpi';
        req.url = url.format(parsed);
      }

      res.setHeader('content-security-policy', CSP);
      next();
    }
  ]
};

if (config.USE_HTTPS) {
  serverOptions.https = {
    key: pkey,
    cert: pcert,
    ca: pca,
    passphrase: ''
  };
}

gulp.task('server', () => {
  connect.server(serverOptions);
});
