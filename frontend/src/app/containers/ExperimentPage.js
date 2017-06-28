import { Localized } from 'fluent-react';
import React from 'react';
import moment from 'moment';

import classnames from 'classnames';
import parser from 'html-react-parser';

import { buildSurveyURL, experimentL10nId, formatDate } from '../lib/utils';

import NotFoundPage from './NotFoundPage';

import EmailDialog from '../components/EmailDialog';
import ExperimentDisableDialog from '../components/ExperimentDisableDialog';
import ExperimentEolDialog from '../components/ExperimentEolDialog';
import ExperimentTourDialog from '../components/ExperimentTourDialog';
import MainInstallButton from '../components/MainInstallButton';
import ExperimentCardList from '../components/ExperimentCardList';
import ExperimentPreFeedbackDialog from '../components/ExperimentPreFeedbackDialog';
import View from '../components/View';
import Warning from '../components/Warning';

import Banner from '../components/Banner';
import Copter from '../components/Copter';
import LayoutWrapper from '../components/LayoutWrapper';


export default class ExperimentPage extends React.Component {
  render() {
    const { getExperimentBySlug, slug } = this.props;
    const experiment = getExperimentBySlug(slug);
    return <ExperimentDetail experiment={experiment} {...this.props} />;
  }
}

// TODO Implement FlowTypes for ExperimentPage

// ExperimentPage.propTypes = {
//   getExperimentBySlug: React.PropTypes.func,
//   params: React.PropTypes.shape({
//     slug: React.PropTypes.string
//   })
// };


const EXPERIMENT_MEASUREMENT_URLS = [
  null,
  null,
  null,
  'https://www.mozilla.org/privacy/websites'
];

export class ExperimentDetail extends React.Component {

  constructor(props) {
    super(props);

    const { isExperimentEnabled, experiment,
            getCookie, removeCookie, hasAddon } = this.props;

    let showEmailDialog = false;
    if (getCookie('first-run')) {
      removeCookie('first-run');
      if (hasAddon) {
        showEmailDialog = true;
      }
    }

    // TODO: Clean this up per #1367
    this.state = {
      enabled: isExperimentEnabled(experiment),
      useStickyHeader: false,
      highlightMeasurementPanel: false,
      isEnabling: false,
      isDisabling: false,
      progressButtonWidth: null,
      showEmailDialog,
      showDisableDialog: false,
      shouldShowTourDialog: false,
      showTourDialog: false,
      showPreFeedbackDialog: false,
      changeHeaderOn: 125,
      stickyHeaderSiblingHeight: 0,
      privacyScrollOffset: 15,
      showEolDialog: false
    };

    // HACK: Set this as a plain object property, so we don't trigger crazy
    // state changes on scrolling events.
    this.didScroll = false;
  }

  l10nId(pieces) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  componentWillReceiveProps(nextProps) {
    const { shouldShowTourDialog, enabled: prevEnabled } = this.state;

    const prevExperiment = this.props.experiment;
    const prevInProgress = prevExperiment && prevExperiment.inProgress;

    const nextExperiment = nextProps.experiment;
    const nextInProgress = nextExperiment && nextExperiment.inProgress;
    const nextEnabled = nextExperiment && nextProps.isExperimentEnabled(nextExperiment);

    if (!nextInProgress && prevInProgress !== nextInProgress) {
      this.setState({
        isEnabling: false,
        isDisabling: false
      });
    }

    this.setState({
      enabled: nextEnabled
    });

    // On enable state change, stop installation indicators & show tour dialog if needed.
    if (prevEnabled !== nextEnabled) {
      // TODO: Tweak experiment install count?
      const showTourDialog = shouldShowTourDialog &&
                             nextExperiment &&
                             !nextExperiment.error;
      this.setState({
        shouldShowTourDialog: false,
        showTourDialog
      });
    }
  }

  getIncompatibleInstalled(incompatible) {
    if (!incompatible) {
      return [];
    }
    const installed = this.props.installedAddons || [];
    return Object.keys(incompatible).filter(guid => (
      installed.indexOf(guid) !== -1
    ));
  }

  renderIncompatibleAddons() {
    const { incompatible } = this.props.experiment;
    const installed = this.getIncompatibleInstalled(incompatible);
    if (installed.length === 0) return null;

    const helpUrl = 'https://support.mozilla.org/kb/disable-or-remove-add-ons';

    return (
      <section className="incompatible-addons">
        <header>
          <Localized id="incompatibleHeader">
            <h3>
              This experiment may not be compatible with add-ons you have installed.
            </h3>
          </Localized>
          <Localized id="incompatibleSubheader">
            <p>
              We recommend <a href={helpUrl}>disabling these add-ons</a> before activating this experiment:
            </p>
          </Localized>
        </header>
        <main>
          <ul>
            {installed.map(guid => (
              <li key={guid}>{incompatible[guid]}</li>
            ))}
          </ul>
        </main>
      </section>
    );
  }

  renderLocaleWarning() {
    const { experiment, locale, hasAddon } = this.props;
    if (hasAddon !== null && locale && ((experiment.locales && !experiment.locales.includes(locale)) || (experiment.locale_blocklist && experiment.locale_blocklist.includes(locale)))) {
      return (
        <Warning titleL10nId="localeUnavailableWarningTitle"
                 titleL10nArgs={ JSON.stringify({ locale_code: locale }) }
                 title="This experiment is not supported in your language (en)."
                 subtitleL10nId="localeWarningSubtitle"
                 subtitle="You can still enable it if you like." />
      );
    }
    return null;
  }

  renderEolBlock() {
    const { experiment, isAfterCompletedDate } = this.props;
    if (!experiment.completed || isAfterCompletedDate(experiment)) { return null; }

    const completedDate = formatDate(experiment.completed);
    const title = `${experiment.title} is ending on ${completedDate}`;

    return (
      <Warning titleL10nId="eolIntroMessage"
               titleL10nArgs={ JSON.stringify({ title: experiment.title, completedDate }) }
               title={ title }>
        <Localized id={this.l10nId('eolWarning')}>
          <div>
            {parser(experiment.eol_warning)}
          </div>
        </Localized>
        <div className="small-spacer" />
        <Localized id="eolNoticeLink">
          <a href="/about" target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </Localized>
      </Warning>
    );
  }

  render() {
    const { experiment, experiments, installed, isAfterCompletedDate, isDev,
            hasAddon, setExperimentLastSeen, clientUUID,
            setPageTitleL10N } = this.props;

    // Loading handled in static with react router; don't return anything if no experiments
    if (experiments.length === 0) { return null; }

    // Show a 404 page if an experiment for this slug wasn't found.
    if (!experiment) { return <NotFoundPage {...this.props} />; }

    setPageTitleL10N('pageTitleExperiment', experiment);

    // Show a 404 page if an experiment is not ready for launch yet
    const utcNow = moment.utc();
    if (moment(utcNow).isBefore(experiment.launch_date)
        && typeof experiment.launch_date !== 'undefined'
        && !isDev) {
      return <NotFoundPage />;
    }

    const { enabled, useStickyHeader, highlightMeasurementPanel,
            showEmailDialog, showDisableDialog, showTourDialog,
            showPreFeedbackDialog, showEolDialog,
            stickyHeaderSiblingHeight } = this.state;

    const { title, contribute_url, bug_report_url, discourse_url, privacy_preamble,
            warning, introduction, measurements, privacy_notice_url, changelog_url,
            thumbnail, subtitle, survey_url, contributors, contributors_extra, contributors_extra_url, details,
            min_release, max_release, graduation_report } = experiment;

    // Set the timestamp for when this experiment was last seen (for
    // ExperimentRowCard updated/launched banner logic)
    setExperimentLastSeen(experiment);

    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
    const graduated = isAfterCompletedDate(experiment);
    const currentExperiments = experiments.filter(x => !isAfterCompletedDate(x));

    let statusType = null;
    if (experiment.error) {
      statusType = 'error';
    } else if (enabled) {
      statusType = 'enabled';
    }

    return (
      <section id="experiment-page">

        {showEmailDialog &&
          <EmailDialog {...this.props}
            onDismiss={() => this.setState({ showEmailDialog: false })} />}

        {showDisableDialog &&
          <ExperimentDisableDialog {...this.props}
            installed={installed}
            onCancel={() => this.setState({ showDisableDialog: false })}
            onSubmit={() => this.setState({ showDisableDialog: false })} />}

        {showTourDialog &&
          <ExperimentTourDialog {...this.props}
            onCancel={() => this.setState({ showTourDialog: false })}
            onComplete={() => this.setState({ showTourDialog: false })} />}

        {showPreFeedbackDialog &&
          <ExperimentPreFeedbackDialog {...this.props}
            surveyURL={surveyURL}
            onCancel={() => this.setState({ showPreFeedbackDialog: false })} />}

        {showEolDialog &&
          <ExperimentEolDialog
            title={title}
            onCancel={() => this.setState({ showEolDialog: false })}
            onSubmit={e => {
              this.setState({ showEolDialog: false });
              this.uninstallExperiment(e);
            }} />}

        <View {...this.props}>

        {hasAddon !== null && (!hasAddon && !graduated) && <section id="testpilot-promo">
          <Banner>
              <LayoutWrapper flexModifier="row-between-reverse">
                <div className="intro-text">
                  <h2 className="banner__title">
                    <Localized id="experimentPromoHeader">
                      <span className="block">Ready for Takeoff?</span>
                    </Localized>
                  </h2>
                  <Localized id="experimentPromoSubheader">
                    <p className="banner__copy"></p>
                  </Localized>
                  <MainInstallButton {...this.props}
                                     experimentTitle={title}
                                     installCallback={ this.installExperiment.bind(this) } />
                </div>
                <Copter/>
              </LayoutWrapper>
          </Banner>
        </section>}

        <div className="default-background">
          <div className={classnames(
              'details-header-wrapper',
            {
              'has-status': !!statusType && !(installed[experiment.addon_id] && installed[experiment.addon_id].manuallyDisabled),
              stick: useStickyHeader
            })
            }>
            <div className={classnames('status-bar', statusType)}>
              {(statusType === 'enabled') && <Localized id="isEnabledStatusMessage" $title={ title }>
                <span>{title} is enabled.</span>
              </Localized>}
              {(statusType === 'error') && <Localized id="installErrorMessage" $title={ title }>
                <span><span></span></span>
              </Localized>}
            </div>
            <LayoutWrapper helperClass="details-header" flexModifier="row-between-breaking">
              <header>
                <h1>{title}</h1>
                {subtitle && <Localized id={this.l10nId('subtitle')}>
                  <h4 className="subtitle">{subtitle}</h4>
                </Localized>}
              </header>
              { this.renderExperimentControls() }
              { this.renderMinimumVersionNotice(title, hasAddon, min_release) }
              { this.renderMaximumVersionNotice(title, hasAddon, max_release) }
            </LayoutWrapper>
          </div>
          <div className="sticky-header-sibling" style={{ height: `${stickyHeaderSiblingHeight}px` }} ></div>

          <div id="details">
              <LayoutWrapper helperClass="details-content" flexModifier="details-content">
                <div className="details-overview">
                  <div className={`experiment-icon-wrapper-${experiment.slug} experiment-icon-wrapper`}>
                    <img className="experiment-icon" src={thumbnail}></img>
                  </div>
                  <div className="details-sections">
                    <section className="user-count">
                      { this.renderInstallationCount() }
                    </section>
                    {!hasAddon && <div>
                     {!!introduction && <section className="introduction">
                       {!!warning && <div className="warning">
                         <Localized id={this.l10nId('warning')}>
                           <strong>{warning}</strong>
                         </Localized>
                       </div>}
                      {!graduated && <Localized id={this.l10nId('introduction')}>
                        <div>
                         {parser(introduction)}
                        </div>
                      </Localized>}
                      </section>}
                    </div>}
                    {!graduated && <div>
                      <section className="stats-section">
                        <table className="stats"><tbody>
                          {hasAddon && <tr>
                            <Localized id="tour">
                              <td>Tour</td>
                            </Localized>
                            <td>
                              <Localized id="tourLink">
                                <a className="showTour" onClick={e => this.showTour(e)} href="#">Launch Tour</a>
                              </Localized>
                            </td>
                          </tr>}
                          {changelog_url && <tr>
                            <Localized id="changelog">
                              <td>Changelog</td>
                            </Localized>
                            <td>
                             {changelog_url && <a href={changelog_url}>{changelog_url}</a>}
                            </td>
                          </tr>}
                          <tr>
                            <Localized id="contribute">
                              <td>Contribute</td>
                            </Localized>
                            <td><a href={contribute_url}>{contribute_url}</a></td>
                          </tr>

                          <tr>
                            <Localized id="bugReports">
                              <td>Bug Reports</td>
                            </Localized>
                            <td><a href={bug_report_url}>{bug_report_url}</a></td>
                          </tr>

                          <tr>
                            <Localized id="discussExperiment" $title={title}>
                              <td></td>
                            </Localized>
                            <td><a href={discourse_url}>{discourse_url}</a></td>
                          </tr>
                        </tbody></table>
                      </section>
                    </div>}
                    <section className="contributors-section">
                      <Localized id="contributorsHeading">
                        <h3>Brought to you by</h3>
                      </Localized>
                      <ul className="contributors">
                        {contributors.map((contributor, idx) => (
                          <li key={idx}>
                            <img className="avatar" width="56" height="56" src={contributor.avatar} />
                            <div className="contributor">
                              <p className="name">{contributor.display_name}</p>
                              {contributor.title && <Localized id={this.l10nId(['contributors', idx, 'title'])}>
                                <p className="title">{contributor.title}</p>
                              </Localized>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    {contributors_extra && <p className="disclaimer">
                        <Localized id={this.l10nId('contributors_extra')}>
                          <span>{contributors_extra}</span>
                        </Localized>
                        {contributors_extra_url && <span>&nbsp;
                          <Localized id="contributorsExtraLearnMore">
                            <a href={contributors_extra_url} target="_blank" rel="noopener noreferrer">Learn more</a>
                          </Localized>
                          .
                        </span>}
                      </p>
                    }
                    </section>
                    {!graduated && <div>
                      <div>
                        {measurements && <section
                              className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                          <Localized id="measurements">
                            <h3>Your privacy</h3>
                          </Localized>
                          <div data-hook="measurements-html" className="measurement">
                            {privacy_preamble && <Localized id={this.l10nId('privacy_preamble')}>
                              <p>{privacy_preamble}</p>
                            </Localized>}
                            <Localized id="experimentMeasurementIntro" $experimentTitle={experiment.title}>
                              <p>
                                 <a href="/privacy"></a>
                              </p>
                            </Localized>
                            <ul>
                              {measurements.map((note, idx) => <Localized key={idx} id={this.l10nId(['measurements', idx])}>
                                <li>{
                                  EXPERIMENT_MEASUREMENT_URLS[idx] === null ? null : <a href={EXPERIMENT_MEASUREMENT_URLS[idx]}></a>
                                }</li>
                              </Localized>)}
                            </ul>
                          </div>
                          {privacy_notice_url && <Localized id="experimentPrivacyNotice" $title={title}>
                            <a className="privacy-policy" href={privacy_notice_url}><span></span></a>
                          </Localized>}
                        </section>}
                      </div>
                    </div>}
                  </div>
                </div>
                {!graduated &&
                  <div className="details-description">
                  {this.renderEolBlock()}
                  {this.renderIncompatibleAddons()}
                  {this.renderLocaleWarning()}
                  {hasAddon && <div>
                   {!!introduction && <section className="introduction">
                     {!!warning && <div className="warning">
                       <Localized id={this.l10nId('warning')}>
                         <strong>{warning}</strong>
                       </Localized>
                     </div>}
                     <Localized id={this.l10nId('introduction')}>
                       <div>
                         {parser(introduction)}
                       </div>
                     </Localized>
                   </section>}
                  </div>}
                  <div className="details-list">
                    {details.map((detail, idx) => (
                     <div key={idx}>
                       <div className="details-image">
                         <img width="680" src={detail.image} />
                         <p className="caption">
                           {detail.headline && <Localized id={this.l10nId(['details', idx, 'headline'])}>
                             <strong>{detail.headline}</strong>
                           </Localized>}
                           {detail.copy && <Localized id={this.l10nId(['details', idx, 'copy'])}>
                             <span>
                               {parser(detail.copy)}
                             </span>
                           </Localized>}
                         </p>
                       </div>
                     </div>
                    ))}
                  </div>
                  {hasAddon && <div>
                    {measurements && <section
                          className={classnames('measurements', { highlight: highlightMeasurementPanel })}>
                      <Localized id="measurements">
                        <h3>Your privacy</h3>
                      </Localized>
                      <div data-hook="measurements-html" className="measurement">
                        {privacy_preamble && <Localized id={this.l10nId('privacy_preamble')}>
                          <p>{privacy_preamble}</p>
                        </Localized>}
                        <Localized id="experimentMeasurementIntro" $experimentTitle={experiment.title}>
                          <p>
                            In addition to the <a href="/privacy">data</a> collected by all Test Pilot experiments, here are the
                            key things you should know about what is happening when you use {experiment.title}:
                          </p>
                        </Localized>
                        <ul>
                          {measurements.map((note, idx) => (
                            <Localized key={idx} id={this.l10nId(['measurements', idx])}>
                              <li>{
                                EXPERIMENT_MEASUREMENT_URLS[idx] === null ? null : <a href={EXPERIMENT_MEASUREMENT_URLS[idx]}></a>
                              }</li>
                            </Localized>
                          ))}
                        </ul>
                      </div>
                      {privacy_notice_url && <Localized id="experimentPrivacyNotice" $title={title}>
                        <a className="privacy-policy" href={privacy_notice_url}><span data-hook="title"></span></a>
                      </Localized>}
                    </section>}
                  </div>}
                  </div>}
                {graduated &&
                  <div className="details-description">
                    <section className="graduation-report">
                      {parser(graduation_report || '')}
                    </section>
                  </div>}
              </LayoutWrapper>
            </div>
          </div>
          <Banner>
            <Localized id="otherExperiments">
              <h2 className="banner__subtitle centered">Try out these experiments as well</h2>
            </Localized>
            <LayoutWrapper flexModifier="card-list">
              <ExperimentCardList {...this.props}
                                  experiments={currentExperiments}
                                  except={experiment.slug}
                                  eventCategory="ExperimentsDetailPage Interactions" />
            </LayoutWrapper>
          </Banner>
        </View>
      </section>
    );
  }

  componentDidMount() {
    this.scrollListener = () => {
      if (!this.didScroll && this.props.hasAddon) {
        this.didScroll = true;
        setTimeout(this.onScroll.bind(this), 1);
      }
    };
    this.props.addScrollListener(this.scrollListener);
  }

  componentWillUnmount() {
    this.props.removeScrollListener(this.scrollListener);
  }

  onScroll() {
    const { getElementOffsetHeight, getScrollY } = this.props;
    const sy = getScrollY();
    const detailsHeaderWrapperHeight = getElementOffsetHeight('.details-header-wrapper');
    const changeHeaderOn = this.setChangeHeaderOn(detailsHeaderWrapperHeight);
    const useStickyHeader = sy > changeHeaderOn;
    const stickyHeaderSiblingHeight = this.setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight, useStickyHeader);

    this.setState({
      changeHeaderOn,
      useStickyHeader,
      stickyHeaderSiblingHeight });
    this.didScroll = false;
  }

  // if there is no content in the .status-bar
  // adjust the initial snap position and the header isn't yet sticky, adjust
  // changeHeaderOn to the top of the .details-header
  // instead of the bottom of the #main-header
  setChangeHeaderOn(detailsHeaderWrapperHeight) {
    const { getElementOffsetHeight, experiment } = this.props;
    const statusBar = experiment.error || this.state.enabled;
    const detailsHeaderHeight = getElementOffsetHeight('.details-header');
    let changeHeaderOn = getElementOffsetHeight('#main-header');

    if (!statusBar) {
      if (this.state.useStickyHeader) {
        changeHeaderOn = this.state.stickyHeaderSiblingHeight;
      } else {
        changeHeaderOn += (detailsHeaderWrapperHeight - detailsHeaderHeight);
      }
    }

    return changeHeaderOn;
  }

  // modify the height of the .sticky-header-sibling if useStickyHeader.
  // Since the height of the details header changes height depending on
  // whether there is a visible status, always set the state to whatever
  // is tallest
  setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight, useStickyHeader) {
    let stickyHeaderSiblingHeight = 0;

    if (useStickyHeader) {
      stickyHeaderSiblingHeight = Math.max(
        detailsHeaderWrapperHeight, this.state.stickyHeaderSiblingHeight);
    }

    return stickyHeaderSiblingHeight;
  }

  // this is set to 100, to accomodate Tracking Protection
  // which has been sending telemetry pings via installs from dev
  // TODO: figure out a non-hack way to toggle user counts when we have
  // telemetry data coming in from prod
  renderInstallationCount() {
    const { experiment, isAfterCompletedDate } = this.props;
    const { completed, title, installation_count } = experiment;

    if (isAfterCompletedDate(experiment)) {
      const completedDate = formatDate(completed);
      return <Localized id="completedDateLabel" $completedDate={completedDate}>
        <span><b></b></span>
      </Localized>;
    }
    if (!installation_count || installation_count <= 100) {
      return <Localized id="userCountContainerAlt" $title={title}>
        <span className="bold"></span>
      </Localized>;
    }
    return <Localized id="userCountContainer" $installation_count={installation_count} $title={title}>
      <span><span className="bold"></span></span>
    </Localized>;
  }

  maxVersionCheck(max) {
    const version = parseInt(this.props.userAgent.split('/').pop(), 10);
    return typeof max === 'undefined' || version <= max;
  }

  minVersionCheck(min) {
    const version = parseInt(this.props.userAgent.split('/').pop(), 10);
    return typeof min === 'undefined' || version >= min;
  }

  isValidVersion(min, max) {
    if (!max) max = Infinity;
    return this.minVersionCheck(min) && this.maxVersionCheck(max);
  }

  renderMinimumVersionNotice(title, hasAddon, min_release) {
    if (hasAddon && !this.minVersionCheck(min_release)) {
      return (
        <div className="upgrade-notice">
          <Localized id="upgradeNoticeTitle" $title={title} $min_release={min_release}>
            <div></div>
          </Localized>
          <Localized id="upgradeNoticeLink">
            <a onClick={e => this.clickUpgradeNotice(e)} href="https://support.mozilla.org/kb/find-what-version-firefox-you-are-using" target="_blank" rel="noopener noreferrer">How to update Firefox.</a>
          </Localized>
        </div>
      );
    }
    return null;
  }

  renderMaximumVersionNotice(title, hasAddon, max_release) {
    if (hasAddon && !this.maxVersionCheck(max_release)) {
      return (
        <div className="upgrade-notice">
          <Localized id="versionChangeNotice" $experiment_title={title}>
            <div></div>
          </Localized>
          <Localized id="versionChangeNoticeLink">
            <a onClick={e => this.clickUpgradeNotice(e)} href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">Get the current version of Firefox.</a>
          </Localized>
        </div>
      );
    }
    return null;
  }

  renderExperimentControls() {
    const { enabled, isEnabling, isDisabling, progressButtonWidth } = this.state;
    const { experiment, installed, isAfterCompletedDate, hasAddon, clientUUID } = this.props;
    const { title, min_release, max_release, survey_url } = experiment;
    const validVersion = this.isValidVersion(min_release, max_release);
    const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);

    if (!hasAddon || !validVersion) {
      return null;
    }
    if (isAfterCompletedDate(experiment)) {
      if (enabled) {
        return (
          <div className="experiment-controls">
            <button onClick={e => { e.preventDefault(); this.setState({ showEolDialog: true }); }} style={{ minWidth: progressButtonWidth }} id="uninstall-button" className={classnames(['button', 'warning'], { 'state-change': isDisabling })}>
              <span className="state-change-inner"></span>
              <Localized id="disableExperimentTransition">
                <span className="transition-text">Disabling...</span>
              </Localized>
              <Localized id="disableExperiment" $title={title}>
                <span className="default-text"></span>
              </Localized>
            </button>
          </div>
        );
      }
      return null;
    }
    if (installed && installed[experiment.addon_id] && installed[experiment.addon_id].manuallyDisabled) {
      return <div className="experiment-controls">
        <button disabled onClick={e => { e.preventDefault(); }} style={{ minWidth: progressButtonWidth }} id="install-button"  className={classnames(['button', 'default'])}>
          <Localized id="experimentManuallyDisabled" $title={title}>
            <span className="default-text"></span>
          </Localized>
        </button>
      </div>;
    }
    if (enabled) {
      return <div className="experiment-controls">
        <Localized id="giveFeedback">
          <a onClick={e => this.handleFeedback(e)} id="feedback-button" className="button default" href={surveyURL} target="_blank" rel="noopener noreferrer">Give Feedback</a>
        </Localized>
        <button onClick={e => this.renderUninstallSurvey(e)} style={{ minWidth: progressButtonWidth }} id="uninstall-button" className={classnames(['button', 'secondary'], { 'state-change': isDisabling })}><span className="state-change-inner"></span>
          <Localized id="disableExperimentTransition">
            <span className="transition-text">Disabling...</span>
          </Localized>
          <Localized id="disableExperiment" $title={title}>
            <span className="default-text"></span>
          </Localized>
        </button>
      </div>;
    }
    return (
      <div className="experiment-controls">
        <Localized id="highlightPrivacy">
          <a onClick={e => this.highlightPrivacy(e)} className="highlight-privacy">Your privacy</a>
        </Localized>
        <button onClick={e => this.installExperiment(e)} style={{ minWidth: progressButtonWidth }} id="install-button" className={classnames(['button', 'default'], { 'state-change': isEnabling })}><span className="state-change-inner"></span>
          <Localized id="enableExperimentTransition">
            <span className="transition-text">Enabling...</span>
          </Localized>
          <Localized id="enableExperiment" $title={title}>
            <span className="default-text"></span>
          </Localized>
        </button>
      </div>
    );
  }

  // scrollOffset lets us scroll to the top of the highlight box shadow animation
  highlightPrivacy(evt) {
    const { getElementOffsetHeight, getElementY, setScrollY } = this.props;
    const { privacyScrollOffset } = this.state;
    const detailsHeaderWrapperHeight = getElementOffsetHeight('.details-header-wrapper');
    const changeHeaderOn = this.setChangeHeaderOn(detailsHeaderWrapperHeight);
    const stickyHeaderSiblingHeight = this.setStickyHeaderSiblingHeight(detailsHeaderWrapperHeight, true);
    evt.preventDefault();
    setScrollY(getElementY('.measurements') + (stickyHeaderSiblingHeight - privacyScrollOffset));
    this.setState({
      changeHeaderOn,
      stickyHeaderSiblingHeight,
      useStickyHeader: true,
      highlightMeasurementPanel: true
    });
    setTimeout(() => {
      this.setState({ highlightMeasurementPanel: false });
    }, 5000);
  }

  clickUpgradeNotice() {
    const { experiment } = this.props;
    // If a user goes to the upgrade SUMO
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Upgrade Notice',
      eventLabel: experiment.title
    });
  }

  feedback() {
    const { experiment } = this.props;
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Give Feedback',
      eventLabel: experiment.title
    });
  }

  showPreFeedbackDialog() {
    const { experiment } = this.props;
    this.setState({
      showPreFeedbackDialog: true
    });

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Give Feedback',
      eventLabel: experiment.title
    });
  }

  handleFeedback(evt) {
    const { pre_feedback_copy } = this.props.experiment;
    if (pre_feedback_copy === null || !pre_feedback_copy) {
      this.feedback();
    } else {
      evt.preventDefault();
      this.showPreFeedbackDialog();
    }
  }

  installExperiment(evt) {
    const { experiment, enableExperiment, sendToGA } = this.props;
    const { isEnabling } = this.state;

    evt.preventDefault();

    // Ignore subsequent clicks if already in progress
    if (isEnabling) { return; }

    let installAddonPromise = null;
    if (!this.props.hasAddon) {
      const { installAddon, requireRestart } = this.props;
      const eventCategory = 'ExperimentDetailsPage Interactions';
      const eventLabel = `Install the Add-on from ${experiment.title}`;
      installAddonPromise = installAddon(
        requireRestart,
        sendToGA,
        eventCategory,
        eventLabel);
    }
    let progressButtonWidth;
    if (this.props.hasAddon) {
      progressButtonWidth = evt.target.offsetWidth;
    }

    this.setState({
      isEnabling: true,
      isDisabling: false,
      shouldShowTourDialog: true,
      progressButtonWidth
    });

    function finishEnabling() {
      enableExperiment(experiment);

      sendToGA('event', {
        eventCategory: 'ExperimentDetailsPage Interactions',
        eventAction: 'Enable Experiment',
        eventLabel: experiment.title
      });
    }

    if (installAddonPromise === null) {
      finishEnabling();
      return;
    }

    installAddonPromise.then(() => {
      return new Promise((resolve, reject) => {
        let i = 0;
        const interval = setInterval(() => {
          i++;
          if (this.props.hasAddon) {
            clearInterval(interval);
            resolve();
          } else if (i > 2000) {
            clearInterval(interval);
            reject(new Error('hasAddon still false after 200 seconds'));
          }
        }, 100);
      });
    }).then(finishEnabling);
  }

  uninstallExperiment(evt) {
    const { experiment, disableExperiment } = this.props;
    const { isDisabling } = this.state;

    evt.preventDefault();

    // Ignore subsequen clicks if already in progress
    if (isDisabling) { return; }

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'Disable Experiment',
      eventLabel: experiment.title
    });

    this.setState({
      isEnabling: false,
      isDisabling: true,
      progressButtonWidth: evt.target.offsetWidth
    });

    disableExperiment(experiment);
  }

  renderUninstallSurvey(evt) {
    evt.preventDefault();

    this.uninstallExperiment(evt);

    this.setState({ showDisableDialog: true });
  }

  showTour(e) {
    e.preventDefault();
    this.setState({ showTourDialog: true });
  }
}

// TODO Implement FlowTypes for ExperimentDetail

// ExperimentDetail.propTypes = {
//   userAgent: React.PropTypes.string,
//   clientUUID: React.PropTypes.string,
//   isDev: React.PropTypes.bool,
//   hasAddon: React.PropTypes.any,
//   experiments: React.PropTypes.array,
//   installed: React.PropTypes.object,
//   installedAddons: React.PropTypes.array,
//   navigateTo: React.PropTypes.func,
//   isAfterCompletedDate: React.PropTypes.func,
//   isExperimentEnabled: React.PropTypes.func,
//   requireRestart: React.PropTypes.func,
//   sendToGA: React.PropTypes.func,
//   openWindow: React.PropTypes.func,
//   uninstallAddon: React.PropTypes.func,
//   enableExperiment: React.PropTypes.func,
//   disableExperiment: React.PropTypes.func,
//   addScrollListener: React.PropTypes.func,
//   removeScrollListener: React.PropTypes.func,
//   getScrollY: React.PropTypes.func,
//   setScrollY: React.PropTypes.func,
//   getElementY: React.PropTypes.func,
//   getElementOffsetHeight: React.PropTypes.func,
//   setExperimentLastSeen: React.PropTypes.func
// };
