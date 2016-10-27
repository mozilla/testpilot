import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const MAX_JUST_LAUNCHED_PERIOD = 2 * ONE_WEEK;
const MAX_JUST_UPDATED_PERIOD = 2 * ONE_WEEK;

export default class ExperimentRowCard extends React.Component {

  render() {
    const { hasAddon, experiment, enabled, isAfterCompletedDate } = this.props;

    const { description, thumbnail, subtitle, slug } = experiment;
    const installation_count = (experiment.installation_count) ? experiment.installation_count : 0;
    const title = experiment.short_title || experiment.title;
    const isCompleted = isAfterCompletedDate(experiment);

    return (
      <div data-hook="show-detail" className={classnames('experiment-summary', {
        enabled,
        'just-launched': this.justLaunched(),
        'just-updated': this.justUpdated(),
        'has-addon': hasAddon
      })}>
        <Link className='overlap-block' to={`/experiments/${slug}`} onClick={() => this.sendToAnalytics()} />
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
        { this.renderInstallationCount(installation_count, isCompleted) }
        { this.renderManageButton(enabled, hasAddon, isCompleted) }
      </div>
    </div>
    );
  }

  // this is set to 100, to accomodate Tracking Protection
  // which has been sending telemetry pings via installs from dev
  // TODO: figure out a non-hack way to toggle user counts when we have
  // telemetry data coming in from prod
  renderInstallationCount(installation_count, isCompleted) {
    if (installation_count <= 100 || isCompleted) return '';
    return (
      <span className="participant-count"
            data-l10n-id="participantCount"
            data-l10n-args={JSON.stringify({ installation_count })}>{installation_count}</span>
    );
  }

  renderManageButton(enabled, hasAddon, isCompleted) {
    if (enabled && hasAddon) {
      return (
        <div className="button card-control secondary" data-l10n-id="experimentCardManage">Manage</div>
      );
    } else if (isCompleted) {
      return (
        <div className="button card-control secondary" data-l10n-id="experimentCardLearnMore">Learn More</div>
      );
    }
    return (
      <div className="button card-control default" data-l10n-id="experimentCardGetStarted">Get Started</div>
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
    const { experiment, enabled, getExperimentLastSeen } = this.props;

    // Enabled & updated trumps launched.
    if (enabled || this.justUpdated()) { return false; }

    // If created awhile ago, don't consider it "just" launched.
    const now = Date.now();
    const created = (new Date(experiment.created)).getTime();
    if ((now - created) > MAX_JUST_LAUNCHED_PERIOD) { return false; }

    // If never seen, *do* consider it "just" launched.
    if (!getExperimentLastSeen(experiment)) { return true; }

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
        return <span data-l10n-id="experimentListEndingTomorrow">Ending Tomorrow</span>;
      } else if (delta < ONE_WEEK) {
        return <span data-l10n-id="experimentListEndingSoon">Ending Soon</span>;
      }
    }
    return '';
  }

  sendToAnalytics() {
    const { eventCategory, experiment, sendToGA } = this.props;
    const { title } = experiment;

    sendToGA('event', {
      eventCategory,
      eventAction: 'Open detail page',
      eventLabel: title
    });
  }

}

ExperimentRowCard.propTypes = {
  experiment: React.PropTypes.object.isRequired,
  hasAddon: React.PropTypes.bool.isRequired,
  enabled: React.PropTypes.bool.isRequired,
  eventCategory: React.PropTypes.string.isRequired,
  getExperimentLastSeen: React.PropTypes.func.isRequired,
  sendToGA: React.PropTypes.func.isRequired,
  navigateTo: React.PropTypes.func.isRequired,
  isAfterCompletedDate: React.PropTypes.func
};
