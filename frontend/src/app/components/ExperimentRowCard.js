// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';

import LocalizedHtml from '../components/LocalizedHtml';

import { buildSurveyURL, experimentL10nId } from '../lib/utils';

import type { InstalledExperiments } from '../reducers/addon';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const MAX_JUST_LAUNCHED_PERIOD = 2 * ONE_WEEK;
const MAX_JUST_UPDATED_PERIOD = 2 * ONE_WEEK;

type ExperimentRowCardProps = {
  experiment: Object,
  hasAddon: any,
  enabled: Boolean,
  installed: InstalledExperiments,
  clientUUID: ?string,
  eventCategory: string,
  getExperimentLastSeen: Function,
  sendToGA: Function,
  navigateTo: Function,
  isAfterCompletedDate: Function
}

export default class ExperimentRowCard extends React.Component {
  props: ExperimentRowCardProps

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { hasAddon, experiment, enabled, isAfterCompletedDate } = this.props;

    const { description, title, subtitle, slug } = experiment;
    const installation_count = (experiment.installation_count) ? experiment.installation_count : 0;
    const isCompleted = isAfterCompletedDate(experiment);

    return (
      <a id="show-detail" href={`/experiments/${slug}`} onClick={() => this.openDetailPage()}
        className={classnames('experiment-summary', {
          enabled,
          'just-launched': this.justLaunched(),
          'just-updated': this.justUpdated(),
          'has-addon': hasAddon
        })}
      >
        <div className="experiment-actions">
          {enabled && <Localized id="experimentListEnabledTab">
            <div className="tab enabled-tab"></div>
          </Localized>}
          {this.justLaunched() && <Localized id="experimentListJustLaunchedTab">
            <div className="tab just-launched-tab"></div>
          </Localized>}
          {this.justUpdated() && <Localized id="experimentListJustUpdatedTab">
            <div className="tab just-updated-tab"></div>
          </Localized>}
        </div>
        <div className={`experiment-icon-wrapper-${experiment.slug} experiment-icon-wrapper`}>
          <div className={`experiment-icon-${experiment.slug} experiment-icon`}></div>
        </div>
      <div className="experiment-information">
        <header>
          <div>
            <h3>{title}</h3>
            {subtitle && <Localized id={this.l10nId('subtitle')}>
              <h4 className="subtitle">{subtitle}</h4>
            </Localized>}
            <h4>{this.statusMsg()}</h4>
          </div>
          {this.renderFeedbackButton()}
        </header>
        <Localized id={this.l10nId('description')}>
          <p>{description}</p>
        </Localized>
        { this.renderInstallationCount(installation_count, isCompleted) }
        { this.renderManageButton(enabled, hasAddon, isCompleted) }
      </div>
    </a>
    );
  }

  // this is set to 100, to accomodate Tracking Protection
  // which has been sending telemetry pings via installs from dev
  // TODO: figure out a non-hack way to toggle user counts when we have
  // telemetry data coming in from prod
  renderInstallationCount(installation_count: number, isCompleted: Boolean) {
    if (installation_count <= 100 || isCompleted) return '';
    const installation_count_node = <span>{installation_count}</span>;
    return (
      <LocalizedHtml id="participantCount" $installation_count={installation_count_node}>
        <span className="participant-count">{installation_count_node} participants</span>
      </LocalizedHtml>
    );
  }

  renderFeedbackButton() {
    if (!this.props.enabled) { return null; }

    const { experiment, installed, clientUUID } = this.props;
    const { title, survey_url } = experiment;
    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
    return (
      <div>
        <Localized id="experimentCardFeedback">
          <a onClick={() => this.handleFeedback()}
             href={surveyURL} target="_blank" rel="noopener noreferrer"
             className="experiment-feedback">
             Feedback
          </a>
        </Localized>
      </div>
    );
  }

  handleFeedback() {
    const { experiment, eventCategory } = this.props;
    this.props.sendToGA('event', {
      eventCategory,
      eventAction: 'Give Feedback',
      eventLabel: experiment.title
    });
  }

  renderManageButton(enabled: Boolean, hasAddon: Boolean, isCompleted: Boolean) {
    if (enabled && hasAddon) {
      return (
        <Localized id="experimentCardManage">
          <div className="button card-control secondary">Manage</div>
        </Localized>
      );
    } else if (isCompleted) {
      return (
        <Localized id="experimentCardLearnMore">
          <div className="button card-control secondary">Learn More</div>
        </Localized>
      );
    }
    return (
      <Localized id="experimentCardGetStarted">
        <div className="button card-control default">Get Started</div>
      </Localized>
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
        return <Localized id="experimentListEndingTomorrow">
          <span className="eol-message">Ending Tomorrow</span>
        </Localized>;
      } else if (delta < ONE_WEEK) {
        return <Localized id="experimentListEndingSoon">
          <span className="eol-message">Ending Soon</span>
        </Localized>;
      }
    }
    return '';
  }

  openDetailPage() {
    const { eventCategory, experiment, sendToGA } = this.props;
    const { title } = experiment;

    sendToGA('event', {
      eventCategory,
      eventAction: 'Open detail page',
      eventLabel: title
    });
  }

}
