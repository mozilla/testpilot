import React from 'react';
import classnames from 'classnames';

import { experimentL10nId } from '../lib/utils';

export default class ExperimentTourDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentStep: 0 };
  }

  l10nId(pieces) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { experiment } = this.props;
    const { currentStep } = this.state;

    const tourSteps = experiment.tour_steps || [];

    const atStart = (currentStep === 0);
    const atEnd   = (currentStep === tourSteps.length - 1);

    const l10nArgs = JSON.stringify({
      title: experiment.title
    });

    return (
      <div className="modal-container">
        <div className={classnames('modal', 'tour-modal')}>
          <header className="tour-header-wrapper">
            <h3 className="tour-header"
                data-l10n-id="tourOnboardingTitle"
                data-l10n-args={l10nArgs}>{experiment.title} enabled!</h3>
                <div className="tour-cancel" onClick={e => this.cancel(e)}/>
          </header>
          {tourSteps.map((step, idx) => (idx === currentStep) && (
            <div key={idx} className="tour-content">
              <div className="tour-image">
                <img src={step.image} />
                <div className="fade">
                  <div className="dot-row">
                    {this.renderDots(tourSteps, currentStep)}
                  </div>
                </div>
              </div>
              {step.copy &&
                <div className="tour-text"
                     data-l10n-id={this.l10nId(['tour_steps', idx, 'copy'])}
                     dangerouslySetInnerHTML={{ __html: step.copy }}></div>}
            </div>
          ))}
          <div className="tour-actions">
            <div onClick={e => this.tourBack(e)}
                 className={classnames('tour-back', { hidden: atStart })}><div/></div>
            <div onClick={e => this.tourNext(e)}
                 className={classnames('tour-next', { 'no-display': atEnd })}><div/></div>
            <div onClick={e => this.complete(e)}
                    className={classnames('tour-done', { 'no-display': !atEnd })}
                    data-l10n-id="tourDoneButton">Done</div>
          </div>
        </div>
      </div>
    );
  }

  renderDots(tourSteps, currentStep) {
    const dots = tourSteps.map((el, index) => {
      if (currentStep === index) return (<div key={index} className="current dot"></div>);
      return (<div key={index} className="dot" onClick={e => this.tourToDot(e, index)} ></div>);
    });

    return dots;
  }

  cancel(e) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    });
    if (this.props.onCancel) { this.props.onCancel(e); }
  }

  complete(e) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    });
    if (this.props.onComplete) { this.props.onComplete(e); }
  }

  tourToDot(e, index) {
    e.preventDefault();
    this.setState({ currentStep: index });

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `dot to step ${index}`
    });
  }

  tourBack() {
    const { currentStep } = this.state;

    const newStep = Math.max(currentStep - 1, 0);
    this.setState({ currentStep: newStep });

    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `back to step ${newStep}`
    });
  }

  tourNext() {
    const { experiment, sendToGA } = this.props;
    const { currentStep } = this.state;

    const newStep = Math.min(currentStep + 1,
                             experiment.tour_steps.length - 1);
    this.setState({ currentStep: newStep });

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `forward to step ${newStep}`
    });
  }
}

ExperimentTourDialog.propTypes = {
  experiment: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onComplete: React.PropTypes.func.isRequired,
  sendToGA: React.PropTypes.func.isRequired
};
