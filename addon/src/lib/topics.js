// Shared list of topics for PubSub usage in bootstrap and webextension
// Note: Must remain pure JS that works in both environments!

const topics = {
  bootstrap: {
    addonManager: ['enabled', 'disabled', 'installed', 'uninstalled'],
    prefs: ['prefsChange'],
    channels: ['testpilot-telemetry'],
    events: ['idle-daily', 'send-metric', 'register-variants'],
    webExtension: ['portConnected'],
    webExtensionAPI: [
      'ready',
      'clickBrowserAction',
      'getLegacyStorage',
      'getAvailableAddons',
      'getCachedClientID',
      'getAddonMetadata',
      'getTelemetryEnvironment',
      'updateClientUUID',
      'updateEnvironment',
      'observeEventTopic',
      'notifyEventTopic',
      'openChannel',
      'submitExternalPing'
    ]
  },
  webExtension: {
    content: ['clearPopup'],
    environment: ['change', 'resources']
  }
};

// Utility to construct topics, with validation in development mode
export default (...parts) => {
  // Outside of development, this just pastes together strings.
  const success = () => parts.join('.');
  if (process.env.NODE_ENV !== 'development') return success();

  // Failure results in an error logged with trace, but string is still built.
  const fail = reason => {
    console.error(`Invalid topic ${parts.join('.')} - ${reason}`); // eslint-disable-line no-console
    console.trace(); // eslint-disable-line no-console
    return parts.join('.');
  };

  // Traverse the tree of topics, validating each part of the incoming parts
  let root = topics;
  for (let idx = 0; idx < parts.length; idx++) {
    const part = parts[idx];
    if (Array.isArray(root)) {
      if (root.includes(part)) return success();
      return fail(`not in leaf list - ${part} => ${root}`);
    }
    if (root === true) {
      if (idx <= parts.length) {
        return fail(`topic parts remain, but exhausted branches at ${part}`);
      }
      return success();
    }
    if (typeof root[part] === 'undefined') {
      return fail(`undefined branch ${part}`);
    }
    root = root[part];
  }

  return success();
};
