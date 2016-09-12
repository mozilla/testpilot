import React from 'react';
import classnames from 'classnames';

import { sendToGA } from '../lib/utils';

export default class ExperimentTourDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentStep: -1 };
  }

  render() {
    const { experiment } = this.props;
    const { currentStep } = this.state;

    const tourSteps = experiment.tour_steps || [];

    const atIntro = (currentStep === -1);
    const atStart = (currentStep === 0);
    const atEnd   = (currentStep === tourSteps.length - 1);

    const l10nArgs = JSON.stringify({
      title: experiment.title
    });

    return (
      <div className="modal-container">
        <div className={classnames('modal', 'onboarding-modal', 'modal-bounce-in',
                                   { 'no-display': !atIntro })}>
          <header>
            <h3 className="title onboarding"
                data-l10n-id="tourOnboardingTitle"
                data-l10n-args={l10nArgs}>{experiment.title} enabled!</h3>
          </header>
          <div className="modal-content">
            <div className="copter-wrapper">
              <div className="copter"></div>
            </div>
          </div>
          <div className="modal-actions">
            <button onClick={e => this.takeTour(e)}
                    className="button default large"
                    data-l10n-id="tourStartButton">Take the Tour</button>
            <a onClick={e => this.cancel(e)}
               className="modal-escape"
               data-l10n-id="tourCancelButton">Skip</a>
          </div>
        </div>
        <div className={classnames('modal', 'tour-modal',
                                   { 'no-display': atIntro })}>
          {tourSteps.map((step, idx) => (idx === currentStep) && (
            <div key={idx} className="tour-content">
              <div className="tour-image"><img src={step.image} /></div>
              {step.copy &&
                <div className="tour-text"
                     dangerouslySetInnerHTML={{ __html: step.copy }}></div>}
            </div>
          ))}
          <div className="tour-actions">
            <div onClick={e => this.tourBack(e)}
                 className={classnames('tour-back', { hidden: atStart, 'no-display': atEnd })}></div>
            <div onClick={e => this.tourNext(e)}
                 className={classnames('tour-next', { 'no-display': atEnd })}></div>
            <button onClick={e => this.complete(e)}
                    className={classnames('button', 'default', 'large', { 'no-display': !atEnd })}
                    data-l10n-id="tourDoneButton">Done</button>
          </div>
        </div>
      </div>
    );
  }

  cancel(e) {
    e.preventDefault();
    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    });
    if (this.props.onCancel) { this.props.onCancel(e); }
  }

  complete(e) {
    e.preventDefault();
    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    });
    if (this.props.onComplete) { this.props.onComplete(e); }
  }

  takeTour() {
    this.setState({ currentStep: 0 });

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'take tour'
    });
  }

  tourBack() {
    const { currentStep } = this.state;

    const newStep = Math.max(currentStep - 1, 0);
    this.setState({ currentStep: newStep });

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `back to step ${this.currentStep}`
    });
  }

  tourNext() {
    const { experiment } = this.props;
    const { currentStep } = this.state;

    const newStep = Math.min(currentStep + 1,
                             experiment.tour_steps.length - 1);
    this.setState({ currentStep: newStep });

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `forward to step ${this.currentStep}`
    });
  }
}
