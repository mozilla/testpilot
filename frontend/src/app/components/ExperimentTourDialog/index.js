// @flow

import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";

import StepModal from "../StepModal";

import type { InstalledExperiments } from "../../reducers/addon";

import { experimentL10nId } from "../../lib/utils";

type ExperimentTourDialogProps = {
  hasAddon?: boolean,
  installed?: InstalledExperiments,
  experiment: Object,
  isExperimentEnabled: Function,
  onCancel: Function,
  onComplete: Function,
  sendToGA: Function,
  isFeatured?: boolean
}

export default class ExperimentTourDialog extends React.Component {
  props: ExperimentTourDialogProps

  applyAdditionalMetricsArgs(gaArgs: Object) {
    const { installed, hasAddon } = this.props;
    return Object.assign(gaArgs, {
      dimension1: hasAddon,
      dimension2: installed ? Object.keys(installed).length > 0 : false,
      dimension3: installed ? Object.keys(installed).length : 0,
      dimension13: "Featured Experiment"
    });
  }

  stepNextPing = (newStep: number) => {
    const { sendToGA, isFeatured, experiment } = this.props;
    let gaArgs = {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: `forward to step ${newStep}`,
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    };

    if (isFeatured) {
      gaArgs = this.applyAdditionalMetricsArgs(gaArgs);
    }

    sendToGA("event", gaArgs);
  };

  stepBackPing = (newStep: number) => {
    const { sendToGA, isFeatured, experiment } = this.props;
    let gaArgs = {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: `back to step ${newStep}`,
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    };

    if (isFeatured) {
      gaArgs = this.applyAdditionalMetricsArgs(gaArgs);
    }

    sendToGA("event", gaArgs);
  };

  stepToDotPing = (index: number) => {
    const { sendToGA, isFeatured, experiment } = this.props;
    let gaArgs = {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: `dot to step ${index}`,
      dimension11: experiment.slug,
      dimension13: "Experiment Detail"
    };

    if (isFeatured) {
      gaArgs = this.applyAdditionalMetricsArgs(gaArgs);
    }

    sendToGA("event", gaArgs);
  };

  l10nId(pieces: string | Array<string | number>) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  renderHeaderTitle = () => {
    const { experiment, isExperimentEnabled } = this.props;
    return (<h3 className={cn("modal-header lighter", {
      enabled: isExperimentEnabled(experiment)
    })}>{experiment.title}</h3>);
  };

  renderStep = (tourSteps: Array<Object>, currentStep: number) => {
    return tourSteps.map((step, idx) => (idx === currentStep) && (
      <div key={idx} className="step-content">
        <div className="step-image">
          <img src={step.image} />
        </div>
        {step.copy &&
          <div className="step-text">
            <Localized id={this.l10nId(["tour_steps", idx, "copy"])}>
              <p>{step.copy}</p>
            </Localized>
          </div>}
      </div>
    ));
  };

  render() {
    return (<StepModal
      steps={this.props.experiment.tour_steps || []}
      onCancel={this.onCancel}
      onComplete={this.onComplete}
      renderStep={this.renderStep}
      renderHeaderTitle={this.renderHeaderTitle}
      wrapperClass={"tour-modal"}
      stepToDotPing={this.stepToDotPing}
      stepNextPing={this.stepNextPing}
      stepBackPing={this.stepBackPing}
    />);
  }

  onCancel = (ev: Object) => {
    const { sendToGA, onCancel, experiment } = this.props;

    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "cancel tour",
      dimension11: experiment.slug
    });
    if (onCancel) { onCancel(ev); }
  };

  onComplete = (ev: Object) => {
    const { sendToGA, onComplete, experiment } = this.props;

    sendToGA("event", {
      eventCategory: "ExperimentDetailsPage Interactions",
      eventAction: "button click",
      eventLabel: "complete tour",
      dimension11: experiment.slug
    });
    if (onComplete) { onComplete(ev); }
  };
}
