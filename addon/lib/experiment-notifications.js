const Notifications = require('sdk/notifications');
const querystring = require('sdk/querystring');
const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');

// Maximum period within which to consider an experiment recently created or
// updated for notification purposes.
const MAX_NOTIFICATION_DELAY_PERIOD = 14 * 24 * 60 * 60 * 1000; // 2 weeks

module.exports = {

  init() {
    // Initialize last-checked timestamp to now
    if (!('notificationsLastChecked' in store)) {
      store.notificationsLastChecked = Date.now();
    }

    // Ensure we have an initial empty object for processed notifications
    if (!('notificationsProcessed' in store)) {
      store.notificationsProcessed = {};
    }
  },

  destroy() {
    // No-op
  },

  uninstall() {
    if ('notificationsLastChecked' in store) {
      delete store.notificationsLastChecked;
    }
    if ('notificationsProcessed' in store) {
      delete store.notificationsProcessed;
    }
  },

  maybeSendNotifications() {
    // Bail if available experiments not loaded yet
    if (!store.availableExperiments) { return; }

    // Did we need to ignore the initial set of notifications?
    if (!ignoreInitialNotifications()) {
      // if not, run through available experiments and check notifications
      Object.keys(store.availableExperiments)
        .forEach(maybeSendNotificationForExperiment);
    }

    // Update the timestamp of last notifications check.
    store.notificationsLastChecked = Date.now();
  }

};

function ignoreInitialNotifications() {
  // Have we seen any notifications at all? If so, bail.
  const processedIDs = Object.keys(store.notificationsProcessed);
  if (processedIDs.length > 0) { return false; }

  // Otherwise, flag all notifications as processed to catch up.
  Object.keys(store.availableExperiments).forEach(id => {
    const experiment = store.availableExperiments[id];
    if (!experiment.notifications) { return; }
    experiment.notifications.forEach(notification =>
      store.notificationsProcessed[notification.id] = Date.now());
  });

  return true;
}

function maybeSendNotificationForExperiment(id) {
  const experiment = store.availableExperiments[id];

  // Bail if there are no notifications
  if (!experiment.notifications) { return; }

  const now = Date.now();

  // Filter for fresh notifications due for sending
  const notifications = experiment.notifications.filter(notification => {
    const notifyAfter = (new Date(notification.notify_after)).getTime();

    // Have we processed this notification before? Skip, if so.
    if (notification.id in store.notificationsProcessed) { return false; }

    // Skip if the notification is too old.
    if (now - notifyAfter > MAX_NOTIFICATION_DELAY_PERIOD) { return false; }

    // Include if it's past time to display this notification.
    if (now > notifyAfter) { return true; }

    // Otherwise, skip this one.
    return false;
  });

  // Bail if there are no available notifications.
  if (notifications.length === 0) { return; }

  // Mark these notifications as processed to skip next time around.
  notifications.forEach(notification =>
    store.notificationsProcessed[notification.id] = Date.now());

  // Now, pick a notification to display (at random, for now)
  const notification = notifications[Math.floor(Math.random() * notifications.length)];

  sendNotificationForExperiment(experiment, notification);
}

function sendNotificationForExperiment(experiment, notification) {
  Notifications.notify({
    title: notification.title,
    // HACK: Simulate a web push notification by injecting 'via' here
    text: 'via testpilot.firefox.com\n' + notification.text,
    iconURL: './notification-icon.png',
    onClick: () => {
      const url = experiment.html_url + '?' + querystring.stringify({
        utm_source: 'testpilot-addon',
        utm_medium: 'firefox-browser',
        utm_campaign: 'push notification',
        utm_content: notification.id
      });
      tabs.open(url);
    }
  });
}
