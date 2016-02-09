var test = require('tape-catch');
var path = require('path');
var fs = require('fs');

test('Running Tests for '+__filename, function(a) {
  a.end();
});

test('Each image in images directory has a retina version', function(t) {
  t.plan(1);
    t.comment(path.resolve(__dirname, '../images'))
  fs.readdir(path.resolve(__dirname, '../images'), function(err, files) {
    if (err) t.fail('fs.readdir call failed, check your paths');

    const retinaFiles = files.filter(function(f) {
      return !!~f.indexOf('@2x');
    });

    t.same(retinaFiles.length, files.length / 2);
  });
});
