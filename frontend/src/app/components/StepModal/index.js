// @flow

/*
 * This is an intermediary component, it adds the minor functionality
 * of stepping through content. This is accomplished by passing in a
 * sub render method to be called when "next" or "back" events are
 * produced. Event handlers are setup here to handle clicking the
 * "next" and "back" buttons, as well has some keystroke handlers.
 */

import classnames from "classnames";
import React from "react";

import Modal from "../Modal";

import "./index.scss";

type StepModalDialogProps = {
  onCancel: Function,
  onComplete: Function,
  wrapperClass: string,
  steps: Array<any>,
  stepNextPing: Function,
  stepBackPing: Function,
  stepToDotPing: Function,
  renderStep: Function,
  renderHeaderTitle: Function
}

type StepModalDialogState = {
  currentStep: number
}

export default class StepModal extends React.Component {
  props: StepModalDialogProps
  state: StepModalDialogState

  constructor(props: StepModalDialogProps) {
    super(props);
    this.state = { currentStep: 0 };
  }

  renderDots(steps: Array<any>, currentStep: number) {
    const dots = steps.map((el, index) => {
      if (currentStep === index) return (<div key={index} className="current dot"></div>);
      return (<div key={index} className="dot" onClick={e => this.stepToDot(e, index)} ></div>);
    });

    return (<div className="fade dot-wrapper">
      <div className="dot-row">{dots}</div>
    </div>);
  }

  renderStepActions(steps: Array<any>, currentStep: number) {
    const atStart = (currentStep === 0);
    const atEnd   = (currentStep === steps.length - 1);

    return (<div className="step-actions">
      <div onClick={() => this.stepBack()}
        className={classnames("step-back", { hidden: atStart })}>
        <div className='step-filler'/>
      </div>

      <div onClick={() => this.stepNext()}
        className={classnames("step-next", { "no-display": atEnd })}>
        <div className='step-filler'/>
      </div>

      <div onClick={e => this.complete(e)}
        className={classnames("step-done", { "no-display": !atEnd })}>
        <div className='step-filler'/>
      </div>

    </div>);
  }

  render() {
    const { currentStep } = this.state;
    const steps = this.props.steps || [];
    const { wrapperClass } = this.props;

    const stepEl = steps.map((step, idx) => (idx === currentStep) && (this.props.renderStep(steps, currentStep)));
    return (
      <Modal {...this.props} wrapperClass={wrapperClass ? `${wrapperClass} step-modal` : "step-modal"}
        onCancel={this.cancel.bind(this)}
        onComplete={this.complete.bind(this)}
        headerTitle={this.props.renderHeaderTitle(steps, currentStep)}
        handleKeyDown={this.handleKeyDown.bind(this)}>
        {stepEl}
        {this.renderStepActions(steps, currentStep)}
        {this.renderDots(steps, currentStep)}
      </Modal>
    );
  }

  cancel(e: Object) {
    e.preventDefault();
    // todo, make sure ga ping is in the cancel method
    if (this.props.onCancel) { this.props.onCancel(e); }
  }

  complete(e: Object) {
    e.preventDefault();
    // todo, make sure ga ping is in the onComplete method
    if (this.props.onComplete) { this.props.onComplete(e); }
  }

  stepToDot(e: Object, index: number) {
    e.preventDefault();
    this.setState({ currentStep: index });

    this.props.stepToDotPing(index);
  }

  stepBack() {
    const { currentStep } = this.state;

    const newStep = Math.max(currentStep - 1, 0);
    this.setState({ currentStep: newStep });

    this.props.stepBackPing(newStep);
  }

  stepNext() {
    const { currentStep } = this.state;

    const newStep = Math.min(currentStep + 1,
      this.props.steps.length - 1);
    this.setState({ currentStep: newStep });

    this.props.stepNextPing(newStep);
  }

  handleKeyDown(ev: Object) {
    const { steps } = this.props;

    switch (ev.key) {
      case "Escape":
        this.cancel(ev);
        break;
      case "ArrowRight":
        this.stepNext();
        break;
      case "ArrowLeft":
        this.stepBack();
        break;
      case "Enter": {
        const { currentStep } = this.state;
        const atEnd = (currentStep === steps.length - 1);
        if (atEnd) this.complete(ev);
        break;
      }
      default:
        break;
    }
  }
}
