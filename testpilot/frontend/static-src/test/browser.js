if (typeof(window) === 'object') {
  const tapeDom = require('tape-dom');
  tapeDom.installCSS();
  tapeDom.stream(require('tape-catch'));
}

require('./collections/*.js', {mode: 'expand'});
require('./lib/*.js', {mode: 'expand'});
require('./models/*.js', {mode: 'expand'});
require('./views/*.js', {mode: 'expand'});
