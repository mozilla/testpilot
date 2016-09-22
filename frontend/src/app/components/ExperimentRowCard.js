import React from 'react';

import classnames from 'classnames';

import { sendToGA } from '../lib/utils';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const MAX_JUST_LAUNCHED_PERIOD = 2 * ONE_WEEK;
const MAX_JUST_UPDATED_PERIOD = 2 * ONE_WEEK;

export default class ExperimentRowCard extends React.Component {

  render() {
    const { hasAddon, experiment, enabled } = this.props;

    const { description, thumbnail } = experiment;
    const installation_count = (experiment.installation_count) ? experiment.installation_count : 0;
    const title = experiment.short_title || experiment.title;

    // TODO: #1138 Replace this highly hackly hook so that the subtitle comes from the model
    const subtitle = (experiment.title === 'No More 404s') ?
      'Powered by the Wayback Machine' : '';

    return (
      <div data-hook="show-detail"
        className={classnames('experiment-summary', {
          enabled,
          'just-launched': this.justLaunched(),
          'just-updated': this.justUpdated(),
          'has-addon': hasAddon
        })}
        onClick={(evt) => this.openDetailPage(evt)}>
        <div className="experiment-actions">
          {enabled && <div data-l10n-id="experimentListEnabledTab" className="tab enabled-tab"></div>}
          {this.justLaunched() && <div data-l10n-id="experimentListJustLaunchedTab" className="tab just-launched-tab"></div>}
          {this.justUpdated() && <div data-l10n-id="experimentListJustUpdatedTab" className="tab just-updated-tab"></div>}
        </div>
      <div className="experiment-icon-wrapper" data-hook="bg"
        style={{
          backgroundColor: experiment.gradient_start,
          backgroundImage: `linear-gradient(135deg, ${experiment.gradient_start}, ${experiment.gradient_stop}`
        }}>
        <div className="experiment-icon" style={{
          backgroundImage: `url(${thumbnail})`
        }}></div>
      </div>
      <div className="experiment-information">
        <header>
          <h3>{title}</h3>
          <h4 className="subtitle">{subtitle}</h4>
          <h4 className="eol-message">{this.statusMsg()}</h4>
        </header>
        <p>{description}</p>
        <span className="participant-count"
              data-l10n-id="participantCount"
              data-l10n-args={JSON.stringify({ installation_count })}>{installation_count}</span>
      </div>
     </div>
    );
  }

  justUpdated() {
    const { experiment, enabled } = this.props;

    // Enabled trumps launched.
    if (enabled) { return false; }

    // If modified awhile ago, don't consider it "just" updated.
    const now = Date.now();
    const modified = (new Date(experiment.modified)).getTime();
    if ((now - modified) > MAX_JUST_UPDATED_PERIOD) { return false; }

    // If modified since the last time seen, *do* consider it updated.
    if (modified > experiment.lastSeen) { return true; }

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

    // If never seen, *do* consider it "just" launched.
    if (!experiment.lastSeen) { return true; }

    // All else fails, don't consider it launched.
    return false;
  }

  statusMsg() {
    const { experiment } = this.props;

    if (experiment.completed) {
      const delta = (new Date(experiment.completed)).getTime() - Date.now();
      if (delta < 0) {
        return '';
      } else if (delta < ONE_DAY) {
        return 'Ending Tomorrow';
      } else if (delta < ONE_WEEK) {
        return 'Ending Soon';
      }
    }
    return '';
  }

  openDetailPage(evt) {
    const { navigateTo, eventCategory, experiment } = this.props;
    const { title } = experiment;

    evt.preventDefault();
    sendToGA('event', {
      eventCategory,
      eventAction: 'Open detail page',
      eventLabel: title
    });
    navigateTo(`/experiments/${experiment.slug}`);
  }

}

ExperimentRowCard.propTypes = {
  experiment: React.PropTypes.object,
  hasAddon: React.PropTypes.bool,
  eventCategory: React.PropTypes.string
};
