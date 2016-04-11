const test = require('tape-catch');
const path = require('path');
const fs = require('fs');

test('Running Tests for ' + __filename, (a) => {
  a.end();
});

test('Each image in images directory has a retina version', (t) => {
  t.plan(1);
  t.comment(path.resolve(__dirname, '../images'));
  fs.readdir(path.resolve(__dirname, '../images'), (err, files) => {
    if (err) t.fail('fs.readdir call failed, check your paths');

    const origFiles = files.filter((f) => {
      return (!~f.indexOf('favicon.ico')); // exclude favicon
    });

    const retinaFiles = files.filter((f) => {
      return !!~f.indexOf('@2x');
    });

    t.same(retinaFiles.length, origFiles.length / 2);
  });
});
