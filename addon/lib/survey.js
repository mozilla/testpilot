/*
 *   This Source Code is subject to the terms of the Mozilla Public License
 *   version 2.0 (the 'License'). You can obtain a copy of the License at
 *   http://mozilla.org/MPL/2.0/.
 */

/*
 *   Originally Liberated from
 *   https://github.com/lmorchard/fireriver/blob/master/lib/main.js#L369
 *   & https://dxr.mozilla.org/mozilla-central/source/browser/components/uitour/UITour.jsm
 */

const Metrics = require('./metrics');
const notify = require('./notify');
const { setTimeout, clearTimeout } = require('sdk/timers');
const tabs = require('sdk/tabs');
const querystring = require('sdk/querystring');
const store = require('sdk/simple-storage').storage;
const _ = require('sdk/l10n').get;

const NUM_STARS = 5; // Number of survey stars
const TEN_MINUTES = 60 * 1000 * 10;

module.exports = {init, destroy, launchSurvey};

// set timecheck flags for initial run.
if (store.surveyChecks === undefined) store.surveyChecks = {};
['twoDaysSent', 'oneWeekSent', 'threeWeeksSent', 'monthAndAHalfSent', 'eol'].forEach(k => {
  if (store.surveyChecks[k] === undefined) store.surveyChecks[k] = {};
});

function init() {
  if (checkForCompletedExperiments()) { return; }
  // wait about 10 minutes before prompting user for survey
  setTimeout(() => {
    // Only check/ask for survey if the user has addons installed.
    if (store.installedAddons && Object.keys(store.installedAddons).length) {
      const experiment = getRandomExperiment();
      const interval = checkInstallDate(experiment.installDate, experiment.addon_id);
      if (!interval) return;
      launchSurvey(experiment, interval);
    }
  }, TEN_MINUTES);
}

function checkForCompletedExperiments() {
  if (store.installedAddons) {
    const now = Date.now();
    const ids = Object.keys(store.installedAddons);
    const eolSurveys = [];
    for (let id of ids) { // eslint-disable-line prefer-const
      let x = store.installedAddons[id]; // eslint-disable-line prefer-const
      if (x.active &&
          (new Date(x.completed)).getTime() < now &&
          !(id in store.surveyChecks.eol)) {
        eolSurveys.push(x);
      }
    }
    const experiment = eolSurveys[Math.floor(Math.random() * eolSurveys.length)];
    if (experiment) {
      tabs.once('open', tab => { // eslint-disable-line no-unused-vars
        setTimeout(() =>
          launchSurvey({
            experiment,
            interval: 'eol',
            label: _('survey_launch_survey_label', experiment.title),
            persistence: 10
          }),
          1000
        );
      });
      return true;
    }
  }
  return false;
}

function destroy() {
  delete store.surveyChecks;
}

function getRandomExperiment() {
  const installedKeys = Object.keys(store.installedAddons);
  const randomIndex = Math.floor(Math.random() * installedKeys.length);
  return store.installedAddons[installedKeys[randomIndex]];
}

// check if the addon is due for a survey at the current interval
function checkInstallDate(installDate, addonId) {
  const dateDiff = Math.round((new Date() - new Date(installDate)) / (1000 * 60 * 60 * 24));

  if (!(addonId in store.surveyChecks.twoDaysSent) && dateDiff >= 2) {
    store.surveyChecks.twoDaysSent[addonId] = true;
    return 2;
  } else if (!(addonId in store.surveyChecks.oneWeekSent) && dateDiff >= 7) {
    store.surveyChecks.oneWeekSent[addonId] = true;
    return 7;
  } else if (!(addonId in store.surveyChecks.threeWeeksSent) && dateDiff >= 21) {
    store.surveyChecks.threeWeeksSent[addonId] = true;
    return 21;
  } else if (!(addonId in store.surveyChecks.monthAndAHalfSent) && dateDiff >= 46) {
    store.surveyChecks.monthAndAHalfSent[addonId] = true;
    return 46;
  }

  return false;
}

function launchSurvey(options) {
  const { experiment, interval } = options;
  showRating(options)
    .then(
      rating => {
        if (!rating) { return Promise.resolve(); }
        Metrics.pingTelemetry(experiment.addon_id, `rated_${rating}`);
        return showSurveyButton(options)
          .then(clicked => {
            if (clicked) {
              const urlParams = {
                id: experiment.addon_id,
                cid: store.clientUUID,
                installed: Object.keys(store.installedAddons),
                rating,
                interval
              };
              const url = `${experiment.survey_url}?${querystring.stringify(urlParams)}`;
              tabs.open(url);
            }
          });
      }
    )
    .catch(() => {});
}

function createRatingUI(win, cb) {
  // Create the fragment holding the rating UI.
  const frag = win.document.createDocumentFragment();

  // Build the star rating.
  const ratingContainer = win.document.createElement('hbox');
  ratingContainer.id = 'star-rating-container';
  ratingContainer.setAttribute('style', 'margin-bottom: 2px');

  function ratingListener(evt) {
    cb(Number(evt.target.getAttribute('data-score'), 10));
  }

  for (let i = 0; i < NUM_STARS; i++) {
    // Create a star rating element.
    const ratingElement = win.document.createElement('toolbarbutton');

    // Style it.
    const starIndex = NUM_STARS - i;
    ratingElement.className = 'plain star-x';
    ratingElement.id = 'star' + starIndex;
    ratingElement.setAttribute('data-score', starIndex);

    // Add the click handler.
    ratingElement.addEventListener('click', ratingListener);

    // Add it to the container.
    ratingContainer.appendChild(ratingElement);
  }

  frag.appendChild(ratingContainer);

  return frag;
}

function showRating(options) {
  return new Promise((resolve) => {
    const experiment = options.experiment;
    const uiTimeout = setTimeout(uiClosed, options.duration || 60000);
    let experimentRating = null;

    const { notifyBox, box } = notify.createNotificationBox({
      label: options.label || _('survey_show_rating_label', experiment.title),
      image: experiment.thumbnail,
      child: win => createRatingUI(win, uiClosed),
      persistence: options.persistence,
      pulse: true,
      callback: () => {
        if (options.interval === 'eol' && experimentRating === null) {
          store.surveyChecks.eol[experiment.addon_id] = true;
        }
        clearTimeout(uiTimeout);
        resolve(experimentRating);
      }
    });

    function uiClosed(rating) {
      experimentRating = rating;
      notifyBox.removeNotification(box);
    }
  });
}

function showSurveyButton(options) {
  return new Promise((resolve) => {
    let clicked = false;
    const { experiment, duration } = options;
    const uiTimeout = setTimeout(uiClosed, duration || 60000);
    const { notifyBox, box } = notify.createNotificationBox({
      label: _('survey_rating_thank_you', experiment.title),
      image: experiment.thumbnail,
      buttons: [{
        label: _('survey_rating_survey_button'),
        callback: () => { clicked = true; }
      }],
      callback: () => {
        clearTimeout(uiTimeout);
        resolve(clicked);
      }
    });
    function uiClosed() {
      notifyBox.removeNotification(box);
    }
    const button = box.getElementsByClassName('notification-button')[0];
    if (button) {
      button.setAttribute('style', 'background: #0095dd; color: #fff; height: 30px; font-size: 13px; border-radius: 2px; border: 0px; text-shadow: 0 0px; box-shadow: 0 0px;');
    }
  });
}
