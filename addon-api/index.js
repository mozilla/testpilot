/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
const xtend = require('xtend');
let defaultConf = require('./package.json').CONFIG;

function ideaTown(config) {
  if (config) {
    defaultConf = xtend(defaultConf, config);
  }

  this.config = defaultConf;

  return this;
}

ideaTown.prototype.metric = function(name, data, addon) {
  require('./ping-server')(this.config, name, data, addon);
};

module.exports = ideaTown;
