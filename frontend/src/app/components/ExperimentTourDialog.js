// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';

import { experimentL10nId } from '../lib/utils';

type ExperimentTourDialogProps = {
  experiment: Object,
  isExperimentEnabled: Function,
  onCancel: Function,
  onComplete: Function,
  sendToGA: Function
}

type ExperimentTourDialogState = {
  currentStep: number
}

export default class ExperimentTourDialog extends React.Component {
  props: ExperimentTourDialogProps
  state: ExperimentTourDialogState

  constructor(props: ExperimentTourDialogProps) {
    super(props);
    this.state = { currentStep: 0 };
  }

  l10nId(pieces: string | Array<string | number>) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { experiment, isExperimentEnabled } = this.props;
    const { currentStep } = this.state;

    const enabled = isExperimentEnabled(experiment);
    const tourSteps = experiment.tour_steps || [];

    const atStart = (currentStep === 0);
    const atEnd   = (currentStep === tourSteps.length - 1);

    const headerTitle = enabled ? (
      <Localized id="tourOnboardingTitle" $title={experiment.title}>
        <h3 className="modal-header"></h3>
      </Localized>) : (<h3 className="modal-header">{experiment.title}</h3>);

    return (
      <div className="modal-container">
        <div className={classnames('modal', 'tour-modal')}>
          <header className="modal-header-wrapper">
            {headerTitle}
            <div className="modal-cancel" onClick={e => this.cancel(e)}/>
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
                <div className="tour-text">
                  <Localized id={this.l10nId(['tour_steps', idx, 'copy'])}>
                    <p>{step.copy}</p>
                  </Localized>
                </div>}
            </div>
          ))}
          <div className="tour-actions">
            <div onClick={() => this.tourBack()}
                 className={classnames('tour-back', { hidden: atStart })}><div/></div>
            <div onClick={() => this.tourNext()}
                 className={classnames('tour-next', { 'no-display': atEnd })}><div/></div>
            <Localized id="tourDoneButton">
              <div onClick={e => this.complete(e)}
                   className={classnames('tour-done', { 'no-display': !atEnd })}>Done</div>
            </Localized>
          </div>
        </div>
      </div>
    );
  }

  renderDots(tourSteps: Array<any>, currentStep: number) {
    const dots = tourSteps.map((el, index) => {
      if (currentStep === index) return (<div key={index} className="current dot"></div>);
      return (<div key={index} className="dot" onClick={e => this.tourToDot(e, index)} ></div>);
    });

    return dots;
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    });
    if (this.props.onCancel) { this.props.onCancel(e); }
  }

  complete(e: Object) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    });
    if (this.props.onComplete) { this.props.onComplete(e); }
  }

  tourToDot(e: Object, index: number) {
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
