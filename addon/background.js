/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser, currentEnvironment */

function log(...args) {
  // console.log(...["[TESTPILOT v2] (background)"].concat(args)); // eslint-disable-lint no-console
}

const storage = browser.storage.local;
const RESOURCE_UPDATE_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
const ONE_DAY = 60 * 60 * 1000 * 24;
const TWO_WEEKS = 2 * 7 * ONE_DAY;

/* browser action constants */
const BROWSER_ACTION_LINK_BASE = [
  "experiments",
  "?utm_source=testpilot-addon",
  "&utm_medium=firefox-browser",
  "&utm_campaign=testpilot-doorhanger"
].join("");
const BROWSER_ACTION_LINK_NOT_BADGED = BROWSER_ACTION_LINK_BASE +
      "&utm_content=not+badged";
const BROWSER_ACTION_LINK_BADGED = BROWSER_ACTION_LINK_BASE +
      "&utm_content=badged";
let BROWSER_ACTION_LINK = BROWSER_ACTION_LINK_NOT_BADGED;

const resources = {
  experiments: [],
  news_updates: []
};

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function getInstalledTxpAddons() {
  return browser.management.getAll().then((infoArray) => {
    const installed = infoArray.map((exp) => exp.id);
    const txpAddons = resources.experiments.map((exp) => exp.id);

    return installed.filter(function(n) {
      return txpAddons.indexOf(n) !== -1;
    });
  });
}

async function setup() {
  setInterval(fetchResources, RESOURCE_UPDATE_INTERVAL);
  setupBrowserAction();
  await fetchResources();
  setDailyPing();
}

async function sendPingOnAlarm(alarmInfo) {
  if (alarmInfo.name === "daily-ping") {
    const { lastPing } = await storage.get({"lastPing": Date.now() - ONE_DAY});
    if (((new Date) - lastPing) > ONE_DAY) {
      const installedTxpAddons = await getInstalledTxpAddons();
      let { clientUUID } = await storage.get("clientUUID");
      if (!clientUUID) {
        await storage.set({ clientUUID: clientUUID = uuidv4() });
      }
      submitPing(alarmInfo.name, "installed-addons", installedTxpAddons, clientUUID);
      await storage.set({lastPing: Date.now()});
    }
  }
}

function setDailyPing() {
  browser.alarms.create("daily-ping", {
    delayInMinutes: 1,
    periodInMinutes: 60 // check hourly
  });

  browser.alarms.onAlarm.addListener(sendPingOnAlarm);
}

function setupBrowserAction() {
  log("setupBrowserAction");
  browser.browserAction.setBadgeBackgroundColor({ color: "#0996f8" });
  browser.browserAction.onClicked.addListener(() => {
    // reset badge immediately
    browser.browserAction.setBadgeText({ text: "" });
    storage.set({ clicked: Date.now() });
    browser.tabs.create({
      url: `${currentEnvironment.baseUrl}${BROWSER_ACTION_LINK}`
    });
  });
}

function fetchResources() {
  log("fetchResources");
  return Promise.all(
    Object.keys(resources).map(path =>
      fetch(`${currentEnvironment.baseUrl}api/${path}.json`)
        .then(res => res.json())
        .then((data) => data.results ? data.results : data)
        .then((data) => [path, data])
        .catch(err => {
          log("fetchResources error", path, err);
          return [path, null];
        }))
  ).then(results => {
    log("fetchResources results", results);
    results.forEach(([path, data]) => (resources[path] = data));
    updateBadgeTextOnNew(resources.experiments, resources.news_updates);
    log("fetchResources results parsed", resources);
  });
}

async function updateBadgeTextOnNew(experiments, news_updates) {
  let { clicked } = await storage.get("clicked");
  if (!clicked) {
    // Set initial button click timestamp if not found
    clicked = Date.now();
    await storage.set({ clicked });
  }

  const newExperiments = (experiments || []).filter(experiment => {
    // don't include experiments which haven't launched yet
    if (new Date() < new Date(experiment.launch_date)) return false;
    const dt = new Date(experiment.modified || experiment.created).getTime();
    return dt >= clicked;
  });

  // check for port number on local, we need to strip it off
  // to properly fetch cookies.
  const baseUrl = currentEnvironment.baseUrl;
  const portIndex = baseUrl.indexOf(":8000");
  const cookieUrl = (portIndex > -1) ? baseUrl.substring(0, portIndex) : baseUrl;

  let lastViewed = 0;
  const cookie = await browser.cookies.get({
    url: cookieUrl,
    name: "updates-last-viewed-date"
  });

  if (cookie) lastViewed = cookie.value;

  /* only show badge for news update if:
   * - has the "major" key
   * - update has been published in the past two weeks
   * - update has not been "seen" by the frontend (lastViewed)
   * - update has not been "seen" by the addon (clicked)
   */
  const twoWeeksAgo = Date.now() - TWO_WEEKS;
  const newsUpdates = (news_updates || [])
    .filter(u => u.major)
    .filter(u => new Date(u.published).getTime() >= twoWeeksAgo)
    .filter(u => new Date(u.published).getTime() >= lastViewed)
    .filter(u => new Date(u.published).getTime() >= clicked);

  BROWSER_ACTION_LINK = (newExperiments.length || newsUpdates.length) > 0
    ? BROWSER_ACTION_LINK_BADGED
    : BROWSER_ACTION_LINK_NOT_BADGED;

  browser.browserAction.setBadgeText({
    text: (newExperiments.length || newsUpdates.length) > 0 ? "!" : ""
  });
}

function submitPing(object, event, addons, clientUUID) {
  return fetch("https://ssl.google-analytics.com/collect", {
    method: "POST",
    body: new URLSearchParams({
      v: 1,
      t: "event",
      ec: "add-on Interactions",
      ea: object,
      el: event,
      tid: "UA-49796218-47",
      cid: clientUUID,
      dimension14: addons
    })
  });
}

// Let's Go!
setup();
