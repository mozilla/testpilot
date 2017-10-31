// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';

import './index.scss';

type ModalProps = {
  onCancel: Function,
  onComplete: Function,
  onStepNext: Function,
  onStepBack: Function,
  wrapperClass: String
}

export default class Modal extends React.Component {
  props: ModalProps
  modalContainer: Object

  componentDidMount() {
    this.modalContainer.focus();
  }

  render() {
    const { headerTitle, wrapperClass, onCancel } = this.props;

    return (
      <div className="modal-container" tabIndex="0"
           ref={modalContainer => { this.modalContainer = modalContainer; }}
           onKeyDown={e => this.handleKeyDown(e)}>
        <div className={`modal ${wrapperClass}`}>
          <header className="modal-header-wrapper">
            {headerTitle}
            <div className="modal-cancel" onClick={e => onCancel(e)}/>
          </header>

          {children}
          {stepActions}
        </div>
      </div>
    );
  }

  handleKeyDown(ev: Object) {
    const { onCancel, onComplete, onStepNext, onStepBack } = this.props;
    ev.preventDefault();

    switch (ev.key) {
      case 'Escape':
        if (onCancel) onCancel(ev);
        break;
      case 'ArrowRight':
        if (onStepNext) onStepNext();
        break;
      case 'ArrowLeft':
        if (onStepBack) onStepBack();
        break;
      case 'Enter': {
        if (onComplete) onComplete(ev);
        break;
      }
      default:
        break;
    }
  }
}
