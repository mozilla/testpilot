/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
*/

const request = require('sdk/request').Request;
const getCookiesFromHost = require('./cookie-manager');

// sets auth headers for a request and passes them to a callback
function authRequest(config, cb) {
  getCookiesFromHost(config.HOSTNAME, function(cookies) {
    const headers = {'Cookie': '',
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'};
    cookies.forEach(function(c) {
      headers.Cookie += c.name + '=' + c.value + ';';
      if (c.name === 'csrftoken') {
        headers['X-CSRFToken'] = c.value;
      }
    });

    cb(headers);
  });
}

function sendMetric(config, title, data, addon) {
  authRequest(config, function(headers) {
    request({
      url: config.BASE_URL + '/api/metrics/?format=json',
      content: JSON.stringify(formatEvent(config.TESTPILOT_PREFIX, title, data, addon)),
      headers: headers,
      onComplete: function(resp) { // eslint-disable-line no-unused-vars
        // console.error(resp);
      }
    }).post();
  });
}

function formatEvent(PREFIX, title, data, addon) {
  return {
    'title': PREFIX + title,
    'experiment': {
      'id': addon.id,
      'name': addon.name,
      'version': addon.version
    },
    'event-data': data
  };
}

module.exports.sendMetric = sendMetric;
