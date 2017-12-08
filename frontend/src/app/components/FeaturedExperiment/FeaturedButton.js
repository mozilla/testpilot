// @flow

import React from 'react';
import { Localized } from 'fluent-react/compat';
import { buildSurveyURL, experimentL10nId } from '../../lib/utils';

import Modal from '../Modal';
import MeasurementSection from '../Measurements';
import MainInstallButton from '../MainInstallButton';

import type { InstalledExperiments } from '../../reducers/addon';

type FeaturedButtonProps = {
  clientUUID?: string,
  enabled: Boolean,
  experiment: Object,
  hasAddon: any,
  installed: InstalledExperiments,
  getExperimentLastSeen: Function,
  sendToGA: Function
}

type FeaturedButtonState = {
  showLegalDialog: boolean
}

export default class FeaturedButton extends React.Component {
  props: FeaturedButtonProps
  state: FeaturedButtonState

  constructor(props: FeaturedButtonProps) {
    super(props);
    this.state = {
      showLegalDialog: false
    };
  }

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  renderLegalLink() {
    const { title } = this.props.experiment;

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

    return (<Localized id={this.l10nId('legal-link')}>
              <p className="main-install__legal">
                By proceeding, you agree to the {terms} and {privacy} of Test Pilot
                and <a href="#" onClick={launchLegalModal}>{title}</a>.
              </p>
            </Localized>);
  }

  handleManage() {
    const { experiment, eventCategory } = this.props;
    this.props.sendToGA('event', {
      eventCategory,
      eventAction: 'Open detail page',
      eventLabel: experiment.title
    });
  }

  handleFeedback() {
    const { experiment, eventCategory } = this.props;
    this.props.sendToGA('event', {
      eventCategory,
      eventAction: 'Give Feedback',
      eventLabel: experiment.title
    });
  }

  render() {
    const { showLegalDialog } = this.state;
    const { experiment, installed, clientUUID, hasAddon,
            enabled, postInstallCallback } = this.props;
    const { slug, survey_url, title } = experiment;

    let Buttons;

    if (enabled && hasAddon) {
      const surveyURL = buildSurveyURL('givefeedback', title, installed, clientUUID, survey_url);
      Buttons = (
        <div>
          <div className="featured-enabled-buttons">
            <Localized id="experimentCardManage">
              <a onClick={() => this.handleManage()}
                 href={`/experiments/${slug}`}
                 className="button secondary manage-button">
                 Manage
              </a>
            </Localized>
            <Localized id="experimentCardFeedback">
              <a onClick={() => this.handleFeedback()}
                 href={surveyURL} target="_blank" rel="noopener noreferrer"
                 className="button default featured-feedback">
                 Feedback
              </a>
            </Localized>
          </div>
          {this.renderLegalLink()}
          {showLegalDialog && <Modal wrapperClass='legal-modal'
                                     onCancel={() => this.setState({ showLegalDialog: false })}
                                     onComplete={() => this.setState({ showLegalDialog: false })}>
            <MeasurementSection experiment={experiment}
                                l10nId={this.l10nId.bind(this)}
                                highlightMeasurementPanel={false}></MeasurementSection>
          </Modal>}
        </div>
      );
    } else {
      Buttons = (<MainInstallButton {...this.props}
                                    experimentTitle={title}
                                    experiment={experiment}
                                    postInstallCallback={postInstallCallback}
                                    experimentLegalLink={this.renderLegalLink()}
                                    eventCategory="HomePage Interactions"
                                    eventLabel="Install the Add-on" />);
    }

    return Buttons;
  }

}
