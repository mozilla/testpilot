/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

exports['test main'] = function(assert) {
  assert.pass('Unit test running!');
};

exports['test main async'] = function(assert, done) {
  assert.pass('async Unit test running!');
  done();
};

require('sdk/test').run(exports);
