// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';

import { buildSurveyURL, experimentL10nId } from '../../lib/utils';
import MainInstallButton from '../MainInstallButton';

import './index.scss';

import type { InstalledExperiments } from '../../reducers/addon';

// import ExperimentPlatforms from '../ExperimentPlatforms';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const MAX_JUST_LAUNCHED_PERIOD = 2 * ONE_WEEK;
const MAX_JUST_UPDATED_PERIOD = 2 * ONE_WEEK;

type FeaturedExperimentProps = {
  experiment: Object,
  hasAddon: any,
  enabled: Boolean,
  isFirefox: Boolean,
  isMinFirefox: Boolean,
  installed: InstalledExperiments,
  clientUUID: ?string,
  eventCategory: string,
  getExperimentLastSeen: Function,
  sendToGA: Function,
  navigateTo: Function,
  isAfterCompletedDate: Function
}

export default class FeaturedExperiment extends React.Component {
  props: FeaturedExperimentProps

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { hasAddon, experiment, enabled // , isAfterCompletedDate
            // isFirefox, isMinFirefox
          } = this.props;

    const { description, title, subtitle, slug, video_url } = experiment;
    // const isCompleted = isAfterCompletedDate(experiment);

    return (
      <div className={classnames('featured-experiment', {
        enabled,
        'just-launched': this.justLaunched(),
        'just-updated': this.justUpdated(),
        'has-addon': hasAddon
      })}>
        <div className="featured-information">
          <header>
            <div className="icon-wrap">
              <div className={`experiment-icon-${slug} experiment-icon`}></div>
            </div>
            <div className="title-wrap">
              <h2>{title}</h2>
              <div className="featured-info-line">
                <h4 className="featured-experiment-type">Firefox experiment</h4>
                {subtitle && <Localized id={this.l10nId('subtitle')}>
                  <h4 className="subtitle">{subtitle}</h4>
                </Localized>}
              </div>
            </div>
          </header>

          <Localized id={this.l10nId('description')}>
            <p className="featured-description">{description}</p>
          </Localized>

      {// <Localized id={this.l10nId('more-detail')}>
       //      <a>MORE DETAIL</a>
       //  </Localized>
      }

          <div className="featured-actions">
            { this.renderManageButton() }
            { this.renderFeedbackButton() }
          </div>

      {// <p className="featured-notice">By proceeding, you agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Notice</a> of Test Pilot and <a href={`/experiments/${slug}`}>{title}</a>.</p>
      }
        </div>

        <div className="featured-video">
          {this.renderFeaturedStatus(enabled)}
          <iframe
            width="100%"
            height="360"
            src={video_url}
            frameBorder="0"
            allowFullScreen/>
        </div>
      </div>
    );
  }

  renderFeaturedStatus(enabled) {
    const justLaunched = this.justLaunched();
    const justUpdated = this.justUpdated();
    const showIcon = (enabled || justLaunched || justUpdated);

    return (
      <div className="featured-status">
        {showIcon && <div className="star-icon"></div>}

        {enabled && <Localized id="experimentListEnabledTab">
          <div className="tab enabled-tab">Enabled</div>
        </Localized>}

        {justLaunched && <Localized id="experimentListJustLaunchedTab">
          <div className="tab just-launched-tab">Just Launched</div>
        </Localized>}

        {justUpdated && <Localized id="experimentListJustUpdatedTab">
          <div className="tab just-updated-tab">Just Updated</div>
        </Localized>}
      </div>);
  }

  renderFeedbackButton() {
    if (!this.props.enabled) { return null; }

    const { experiment, installed, clientUUID } = this.props;
    const { title, survey_url } = experiment;
    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
    return (
        <Localized id="experimentCardFeedback">
          <a onClick={() => this.handleFeedback()}
             href={surveyURL} target="_blank" rel="noopener noreferrer"
             className="button default featured-feedback">
             Feedback
          </a>
        </Localized>
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

  renderManageButton() {
    const { experiment } = this.props;
    const { title } = experiment;
    return (<MainInstallButton {...this.props}
              experimentTitle={title}
              eventCategory="HomePage Interactions"
              eventLabel="Install the Add-on"/>);

    // if (enabled && hasAddon) {
    //   return (
    //     <Localized id="experimentCardManage">
    //       <a className="button secondary">Manage</a>
    //     </Localized>
    //   );
    // } else if (!isFirefox || !isMinFirefox) {

    //   console.log('IS FIREFOX: ', isFirefox);

    //   return (

    //   );
    // } else return (
    //   <Localized id="experimentCardGetStarted">
    //     <a className="button default">Get Started</a>
    //   </Localized>
    // );
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
