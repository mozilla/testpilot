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
const {Cc, Ci} = require('chrome');
const {setTimeout} = require('sdk/timers');
const tabs = require('sdk/tabs');
const querystring = require('sdk/querystring');
const store = require('sdk/simple-storage').storage;

const NUM_STARS = 5; // Number of survey stars
const FIVE_MINUTES = 60 * 1000 * 5;

module.exports = {init: init, destroy: destroy};

// set timecheck flags for initial run.
if (store.surveyChecks === undefined) store.surveyChecks = {};
['twoDaysSent', 'oneWeekSent', 'threeWeeksSent', 'monthAndAHalfSent'].forEach(k => {
  if (store.surveyChecks[k] === undefined) store.surveyChecks[k] = {};
});

function init() {
  // wait about 5 minutes before prompting user for survey
  setTimeout(() => {
    // Only check/ask for survey if the user has addons installed.
    if (store.installedAddons && Object.keys(store.installedAddons).length) {
      showRandomSurvey(getRandomExperiment());
    }
  }, FIVE_MINUTES);
}

function destroy() {
  delete store.surveyChecks;
}

function getRandomExperiment() {
  const installedKeys = Object.keys(store.installedAddons);
  const randomIndex = Math.floor(Math.random() * installedKeys.length);
  return store.installedAddons[installedKeys[randomIndex]];
}

function showRandomSurvey(experiment) {
  launchSurvey({
    label: 'Please Rate the Test Pilot experiment ' + experiment.title,
    image: experiment.thumbnail,
    addonId: experiment.addon_id,
    surveyUrl: experiment.survey_url,
    installDate: experiment.installDate
  });
}

function getAnonEl(win, box, attrName) {
  return win.document.getAnonymousElementByAttribute(box, 'anonid', attrName);
}

// check if the addon is due for a survey at the current interval
function checkInstallDate(installDate, addonId) {
  const dateDiff = new Date().getDate() - new Date(installDate).getDate();

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
  const interval = checkInstallDate(options.installDate, options.addonId);
  if (typeof interval !== 'number') return;

  const WM = Cc['@mozilla.org/appshell/window-mediator;1'].
                        getService(Ci.nsIWindowMediator);
  const win = WM.getMostRecentWindow('navigator:browser');
  const browser = win.gBrowser;
  const notifyBox = browser.getNotificationBox();

  const addonId     = options.addonId || 'default_id';
  const duration    = options.duration || 60; // default is 1 minute.
  const surveyUrl   = options.surveyUrl || '';
  const persistence = options.persistence || 0;

  const box = notifyBox.appendNotification(
    options.label    || 'Default label',
    options.value    || 'Default Value',
    options.image    || 'invalid.png',
    options.priority || notifyBox.PRIORITY_INFO_LOW,
    options.buttons  || []);

  const messageText = getAnonEl(win, box, 'messageText');
  const messageImage = getAnonEl(win, box, 'messageImage');

  const ratingFragment = getRatingUI(win, notifyBox, box, messageText,
                                     addonId, interval, surveyUrl);

  // Make sure the stars are not pushed to the right by the spacer.
  const rightSpacer = win.document.createElement('spacer');
  rightSpacer.flex = 20;
  ratingFragment.appendChild(rightSpacer);

  messageText.flex = 0; // Collapse the space before the stars.
  const leftSpacer = messageText.nextSibling;
  leftSpacer.flex = 0;

  box.appendChild(ratingFragment);

  box.classList.add('heartbeat');
  box.persistence = persistence;
  messageImage.classList.add('heartbeat', 'pulse-onshow');
  messageText.classList.add('heartbeat');
  messageImage.setAttribute('style', 'filter: invert(80%)');

  // End the survey if the user hasn't responded before expiration.
  if (!options.privateWindowsOnly) {
    setTimeout(() => {
      notifyBox.removeNotification(box);
    }, 1000 * duration);
  }
}

function getRatingUI(win, notifyBox, box, messageText, addonId,
                     interval, surveyUrl) {
  // Create the fragment holding the rating UI.
  const frag = win.document.createDocumentFragment();

  // Build the star rating.
  const ratingContainer = win.document.createElement('hbox');
  ratingContainer.id = 'star-rating-container';
  ratingContainer.setAttribute('style', 'margin-bottom: 2px');

  function ratingListener(evt) {
    const rating = Number(evt.target.getAttribute('data-score'), 10);

    // send data to SurveyGizmo via querystrings
    notifyBox.removeNotification(box);
    const params = querystring.stringify({id: addonId,
                                          rating: rating,
                                          interval: interval,
                                          installed: Object.keys(store.installedAddons)});
    tabs.open(`${surveyUrl}?${params}`);
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
