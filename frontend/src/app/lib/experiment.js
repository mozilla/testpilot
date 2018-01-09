// @flow

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const MAX_JUST_LAUNCHED_PERIOD = 2 * ONE_WEEK;
const MAX_JUST_UPDATED_PERIOD = 2 * ONE_WEEK;

export function justUpdated(experiment: Object) {
  if (typeof experiment.modified === "undefined") return false;
  // If modified awhile ago, don't consider it "just" updated.
  const now = Date.now();
  const modified = (new Date(experiment.modified)).getTime();
  if ((now - modified) > MAX_JUST_UPDATED_PERIOD) { return false; }

  return true;
}

export function justLaunched(experiment: Object) {
  // updated trumps launched.
  if (justUpdated(experiment)) { return false; }

  // If created awhile ago, don't consider it "just" launched.
  const now = Date.now();
  const created = (new Date(experiment.created)).getTime();
  if ((now - created) > MAX_JUST_LAUNCHED_PERIOD) { return false; }

  return true;
}
