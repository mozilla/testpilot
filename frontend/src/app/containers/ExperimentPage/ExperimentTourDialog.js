// @flow

import { Localized } from 'fluent-react/compat';
import React from 'react';

import StepModal from '../../components/StepModal';

import { experimentL10nId } from '../../lib/utils';

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

  renderHeaderTitle() {
    const { experiment, isExperimentEnabled } = this.props;
    const enabled = isExperimentEnabled(experiment);

    return enabled ? (
        <Localized id="tourOnboardingTitle" $title={experiment.title}>
          <h3 className="modal-header">{experiment.title} enabled!</h3>
        </Localized>) : (<h3 className="modal-header">{experiment.title}</h3>);
  }

  renderStep(tourSteps: Array<Object>, currentStep: number) {
    return tourSteps.map((step, idx) => (idx === currentStep) && (
        <div key={idx} className="step-content">
          <div className="step-image">
            <img src={step.image} />
          </div>
          {step.copy &&
            <div className="step-text">
              <Localized id={this.l10nId(['tour_steps', idx, 'copy'])}>
                <p>{step.copy}</p>
              </Localized>
            </div>}
        </div>
    ));
  }

  render() {
    const { sendToGA, experiment } = this.props;
    const { currentStep } = this.state;
    const tourSteps = experiment.tour_steps || [];

    const myProps = {
      steps: tourSteps,
      onCancel: this.onCancel.bind(this),
      onComplete: this.onComplete.bind(this),
      renderStep: this.renderStep.bind(this),
      wrapperClass: 'tour-modal',
      headerTitle: this.renderHeaderTitle(tourSteps, currentStep),
      stepNextPing: (newStep) => {
        sendToGA('event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'button click',
          eventLabel: `forward to step ${newStep}`
        });
      },
      stepBackPing: (newStep) => {
        sendToGA('event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'button click',
          eventLabel: `back to step ${newStep}`
        });
      },
      stepToDotPing: (index) => {
        sendToGA('event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'button click',
          eventLabel: `dot to step ${index}`
        });
      }
    };

    return (<StepModal {...myProps} />);
  }

  onCancel(ev: Object) {
    const { sendToGA, onCancel } = this.props;

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    });
    if (onCancel) { onCancel(ev); }
  }

  onComplete(ev: Object) {
    const { sendToGA, onComplete } = this.props;

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    });
    if (onComplete) { onComplete(ev); }
  }
}
