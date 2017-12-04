// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';

import { buildSurveyURL, experimentL10nId } from '../../lib/utils';
import MainInstallButton from '../MainInstallButton';
import MeasurementSection from '../Measurements';
import ExperimentTourDialog from '../ExperimentTourDialog';
import Modal from '../Modal';

import './index.scss';

import type { InstalledExperiments } from '../../reducers/addon';

import ExperimentPlatforms from '../ExperimentPlatforms';

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
  navigateTo: Function
}

type FeaturedExperimentState = {
  showLegalDialog: boolean,
  shouldShowTourDialog: boolean,
  showTourDialog: boolean
}
export default class FeaturedExperiment extends React.Component {
  props: FeaturedExperimentProps
  state: FeaturedExperimentState

  constructor(props: HomePageWithAddonProps) {
    super(props);
    this.state = {
      showLegalDialog: false,
      shouldShowTourDialog: false,
      showTourDialog: false,
    };
  }

  componentWillReceiveProps(nextProps: FeaturedExperimentProps, prevProps: FeaturedExperimentProps) {
    const { shouldShowTourDialog } = this.state;

    // On enable state change, stop installation indicators & show tour dialog if needed.
    if (nextProps.enabled !== prevProps.enabled) {
      const showTourDialog = shouldShowTourDialog && nextProps.enabled;
      this.setState({
        shouldShowTourDialog: false,
        showTourDialog
      });
    }
  }

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { experiment, enabled } = this.props;
    const { showLegalDialog } = this.state;
    const { description, title, subtitle, slug, video_url } = experiment;

    return (
      <div className={classnames('featured-experiment', {
        enabled,
        'just-launched': this.justLaunched(),
        'just-updated': this.justUpdated()
      })}>
        <div className="featured-information">
          <header>
            <div className="icon-wrap">
              <div className={`experiment-icon-${slug} experiment-icon`}></div>
            </div>
            <div className="title-wrap">
              <h2>{title}</h2>
              <div className="featured-info-line">
                <ExperimentPlatforms experiment={experiment} />
                {subtitle && <Localized id={this.l10nId('subtitle')}>
                  <h4 className="subtitle">{subtitle}</h4>
                </Localized>}
              </div>
            </div>
          </header>

          <Localized id={this.l10nId('description')}>
            <p className="featured-description">{description}</p>
          </Localized>

          {!enabled && <Localized id='moreDetail'>
            <a href={`/experiments/${slug}`}>More Detail</a>
          </Localized>}

          <div className="featured-actions">
            { this.renderButton() }
          </div>

        </div>

        <div className="featured-video">
          {this.renderFeaturedStatus(enabled)}
          <iframe
            width="100%"
            height="360"
            src={video_url}
            frameBorder="0"
            allowFullScreen />
        </div>

        {showLegalDialog && <Modal wrapperClass='legal-modal'
                                   onCancel={() => this.setState({ showLegalDialog: false })}
                                   onComplete={() => this.setState({ showLegalDialog: false })}>
          <MeasurementSection experiment={experiment}
                              l10nId={this.l10nId.bind(this)}
                              highlightMeasurementPanel={false}></MeasurementSection>
        </Modal>}

        {showTourDialog && <ExperimentTourDialog {...this.props}
                             onCancel={() => this.setState({ showTourDialog: false })}
                             onComplete={() => this.setState({ showTourDialog: false })}
        />}
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

        {justLaunched && <Localized id="experimentListJustLaunchedTab">
          <div className="tab just-launched-tab">Just Launched</div>
        </Localized>}

        {justUpdated && <Localized id="experimentListJustUpdatedTab">
          <div className="tab just-updated-tab">Just Updated</div>
        </Localized>}

        {enabled && <Localized id="experimentListEnabledTab">
          <div className="tab enabled-tab">Enabled</div>
        </Localized>}
      </div>);
  }

  handleFeedback() {
    const { experiment, eventCategory } = this.props;
    this.props.sendToGA('event', {
      eventCategory,
      eventAction: 'Give Feedback',
      eventLabel: experiment.title
    });
  }

  renderButton() {
    const { experiment, installed, clientUUID, hasAddon, enabled } = this.props;
    const { slug, survey_url, title } = experiment;
    const terms = <Localized id="landingLegalNoticeTermsOfUse">
      <a href="/terms">terms</a>
    </Localized>;
    const privacy = <Localized id="landingLegalNoticePrivacyNotice">
      <a href="/privacy">privacy</a>
    </Localized>;

    const launchLegalModal = (ev) => {
      ev.preventDefault();
      this.setState({ showLegalDialog: true });
    };

    const experimentLegalLink = (<Localized id={this.l10nId('legal-link')}>
      <p className="main-install__legal">
        By proceeding, you agree to the {terms} and {privacy} of Test Pilot
        and <a href="#" onClick={launchLegalModal}>{title}</a>.
      </p>
                                 </Localized>);

    let Buttons = (<MainInstallButton {...this.props}
                                      experimentTitle={title}
                                      experiment={experiment}
                                      experimentLegalLink={experimentLegalLink}
                                      eventCategory="HomePage Interactions"
                                      eventLabel="Install the Add-on"/>);
    if (enabled && hasAddon) {
      const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
      Buttons = (
        <div>
          <div className="featured-enabled-buttons">
            <Localized id="experimentCardManage">
              <a href={`/experiments/${slug}`} className="button secondary">Manage</a>
            </Localized>
            <Localized id="experimentCardFeedback">
              <a onClick={() => this.handleFeedback()}
                 href={surveyURL} target="_blank" rel="noopener noreferrer"
                 className="button default featured-feedback">
                 Feedback
              </a>
            </Localized>
          </div>
          {experimentLegalLink}
        </div>
      );
    } else this.setState({shouldShowTourDialog: true});

    return Buttons;
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
