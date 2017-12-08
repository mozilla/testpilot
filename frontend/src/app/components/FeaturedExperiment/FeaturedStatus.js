// @flow

import React from 'react';
import { Localized } from 'fluent-react/compat';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const MAX_JUST_LAUNCHED_PERIOD = 2 * ONE_WEEK;
const MAX_JUST_UPDATED_PERIOD = 2 * ONE_WEEK;

type FeaturedStatusProps = {
  enabled: Boolean,
  experiment: Object,
  getExperimentLastSeen: Function
}

export default class FeaturedStatus extends React.Component {
  props: FeaturedStatusProps

  render() {
    const { enabled } = this.props;
    const launched = this.justLaunched();
    const updated = this.justUpdated();
    const showIcon = (enabled || launched || updated);

    return (
        <div className="featured-status">
          {showIcon && <div className="star-icon"></div>}

          {launched && <Localized id="experimentListJustLaunchedTab">
            <div className="tab just-launched-tab">Just Launched</div>
          </Localized>}

          {updated && <Localized id="experimentListJustUpdatedTab">
            <div className="tab just-updated-tab">Just Updated</div>
          </Localized>}

          {enabled && <Localized id="experimentListEnabledTab">
            <div className="tab enabled-tab">Enabled</div>
          </Localized>}
        </div>
    );
  }

  justUpdated() {
    const { experiment, enabled, getExperimentLastSeen } = this.props;

    // Enabled trumps launched.
    if (enabled) { return false; }

    // If modified awhile ago, don't consider it "just" updated.
    const now = Date.now();
    const modified = (new Date(experiment.modified)).getTime();
    if ((now - modified) > MAX_JUST_UPDATED_PERIOD) { return false; }

    // If modified since the last time seen, *do* consider it updated.
    if (modified > getExperimentLastSeen(experiment)) { return true; }

    // All else fails, don't consider it updated.
    return false;
  }

  justLaunched() {
    const { experiment, enabled } = this.props;

    // Enabled & updated trumps launched.
    if (enabled || this.justUpdated()) { return false; }

    // If created awhile ago, don't consider it "just" launched.
    const now = Date.now();
    const created = (new Date(experiment.created)).getTime();
    if ((now - created) > MAX_JUST_LAUNCHED_PERIOD) { return false; }

    // All else fails, don't consider it launched.
    return true;
  }
}
