/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

function Router(mod) {
  this.mod = mod;
  this._events = {};
  this.mod.port.on('from-web-to-addon', function(data) {
    if (this._events[data.type]) this._events[data.type](data.detail);
  }.bind(this));
  return this;
}

Router.prototype.on = function(name, f) {
  this._events[name] = f;
  return this;
};

Router.prototype.send = function(name, data) {
  this.mod.port.emit('from-addon-to-web', {type: name, detail: data});
  return this;
};

module.exports = Router;
