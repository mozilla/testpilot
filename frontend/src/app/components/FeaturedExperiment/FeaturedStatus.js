// @flow

import React from "react";
import { Localized } from "fluent-react/compat";
import { justUpdated, justLaunched } from "../../lib/experiment";

type FeaturedStatusProps = {
  enabled: boolean,
  experiment: Object
}

export default class FeaturedStatus extends React.Component {
  props: FeaturedStatusProps

  render() {
    const { enabled, experiment } = this.props;

    // enabled trumps justUpdated
    const updated = enabled ? false : justUpdated(experiment);
    // justUpdated and enabled trump justLaunched
    const launched = (enabled || updated) ? false : justLaunched(experiment);

    return (
      <div className="featured-experiment__status">

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
}
