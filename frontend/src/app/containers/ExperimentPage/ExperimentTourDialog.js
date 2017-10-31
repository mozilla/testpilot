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

  modalContainer: Object

  constructor(props: ExperimentTourDialogProps) {
    super(props);
    this.state = { currentStep: 0 };
  }

  l10nId(pieces: string | Array<string | number>) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  componentDidMount() {
    this.modalContainer.focus();
  }

  renderHeaderTitle() {
    const { experiment, isExperimentEnabled } = this.props;
    const enabled = isExperimentEnabled(experiment);

    const headerTitle = enabled ? (
        <Localized id="tourOnboardingTitle" $title={experiment.title}>
          <h3 className="modal-header">{experiment.title} enabled!</h3>
        </Localized>) : (<h3 className="modal-header">{experiment.title}</h3>);
  }

  renderStep(tourSteps: Array<Object>, currentStep: number) {
    return tourSteps.map((step, idx) => (idx === currentStep) && (
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
    ))
  }

  render() {
    const { sendToGA, experiment } = this.props;
    const { currentStep } = this.state;
    const tourSteps = experiment.tour_steps || [];

    const myProps = {
      steps: tourSteps,
      onCancel: this.onCancel,
      onComplete: this.onComplete,
      renderStep: this.renderUpdate,
      wrapperClass: 'news-updates-modal',
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
    const { sendToGA, onCancel } = this.props;

    sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    });
    if (onComplete) { onComplete(ev); }
  }
}
