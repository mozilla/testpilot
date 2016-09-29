const fs = require('fs');

const gulp = require('gulp');
const config = require('../config.js');

const connect = require('gulp-connect');
const historyApiFallback = require('connect-history-api-fallback');

const pkey = fs.readFileSync('./frontend/certs/server/my-server.key.pem');
const pcert = fs.readFileSync('./frontend/certs/server/my-server.crt.pem');
const pca = fs.readFileSync('./frontend/certs/server/my-private-root-ca.crt.pem');

const serverOptions = {
  root: config.DEST_PATH,
  livereload: false,
  host: '0.0.0.0',
  port: config.SERVER_PORT,
  middleware: (connect, ops) => [historyApiFallback({})]
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
