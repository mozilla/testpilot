// @flow

import cn from 'classnames';
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

export default class ExperimentTourDialog extends React.Component {
  props: ExperimentTourDialogProps

  l10nId(pieces: string | Array<string | number>) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  renderHeaderTitle() {
    const { experiment, isExperimentEnabled } = this.props;
    return (<Localized id="tourOnboardingTitle" $title={experiment.title}>
              <h3 className={cn('modal-header lighter', {
                enabled: isExperimentEnabled({ addon_id: `@${experiment.title}` })
              })}>{experiment.title}</h3>
            </Localized>);
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
    const tourSteps = experiment.tour_steps || [];

    const myProps = {
      steps: tourSteps,
      onCancel: this.onCancel.bind(this),
      onComplete: this.onComplete.bind(this),
      renderStep: this.renderStep.bind(this),
      wrapperClass: 'tour-modal',
      renderHeaderTitle: this.renderHeaderTitle.bind(this),
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
