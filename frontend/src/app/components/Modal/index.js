// @flow

import React from "react";

import "./index.scss";

type ModalProps = {
  wrapperClass: string,
  onCancel: Function,
  onComplete: Function,
  handleKeyDown?: Function,
  headerTitle?: React.Element<any>,
  children: Array<React.Element<any>> | React.Element<any>
}

export default class Modal extends React.Component {
  props: ModalProps
  modalContainer: Object

  componentDidMount() {
    this.modalContainer.focus();
  }

  render() {
    const { headerTitle, wrapperClass, onCancel, children } = this.props;

    const handleKeyDown = this.props.handleKeyDown ?
      this.props.handleKeyDown.bind(this) :
      this.handleKeyDown.bind(this);

    return (
      <div className="modal-container" tabIndex="0"
        ref={modalContainer => { this.modalContainer = modalContainer; }}
        onKeyDown={e => handleKeyDown(e)}>
        <div className={`modal ${wrapperClass}`}>
          {!headerTitle && <div className="modal-cancel floating" onClick={e => onCancel(e)}/>}
          {headerTitle && <header className="modal-header-wrapper">
            {headerTitle}
            <div className="modal-cancel" onClick={e => onCancel(e)}/>
          </header>}

          {children}
        </div>
      </div>
    );
  }

  handleKeyDown(ev: Object) {
    const { onCancel, onComplete } = this.props;

    switch (ev.key) {
      case "Escape":
        if (onCancel) onCancel(ev);
        break;
      case "Enter": {
        if (onComplete) onComplete(ev);
        break;
      }
      default:
        break;
    }
  }
}
