const fs = require('fs');
const url = require('url');

const gulp = require('gulp');
const config = require('../config.js');

const connect = require('gulp-connect');

const pkey = fs.readFileSync('./frontend/certs/server/my-server.key.pem');
const pcert = fs.readFileSync('./frontend/certs/server/my-server.crt.pem');
const pca = fs.readFileSync('./frontend/certs/server/my-private-root-ca.crt.pem');

const serverOptions = {
  root: config.DEST_PATH,
  livereload: false,
  host: '0.0.0.0',
  port: config.SERVER_PORT,
  middleware: (connect, ops) => [
    // Rewrite /path to /path/index.html
    (req, res, next) => {
      const parsed = url.parse(req.url);
      const { pathname } = parsed;
      // If no dot or trailing slash, try rewriting
      if (pathname.indexOf('.') === -1 &&
          pathname.substring(pathname.length - 1) !== '/') {
        parsed.pathname = pathname + '/index.html';
        req.url = url.format(parsed);
      }
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
