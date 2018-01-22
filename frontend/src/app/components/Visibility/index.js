// @flow

import React from "react";
import classnames from "classnames";

type BannerProps = {
  isVisible?: boolean,
  className?: string,
  children?: Array<any>
};

type BannerState = {
  isVisible: boolean
};

export default class Visibility extends React.Component {
  props: BannerProps;
  state: BannerState;
  elementRef: Element;

  constructor(props: BannerProps) {
    super(props);
    this.state = { isVisible: !!props.isVisible };
  }

  componentDidMount() {
    register(this.handleVisibilityChange);
    this.handleVisibilityChange();
  }

  componentWillUnmount() {
    unregister(this.handleVisibilityChange);
  }

  setElementRef = (elementRef: Element) => (this.elementRef = elementRef);

  handleVisibilityChange = () => {
    if (!this.elementRef) {
      return;
    }

    const el = this.elementRef;
    const wh = window.innerHeight;
    const rect = el.getBoundingClientRect();

    const currIsVisible = this.state.isVisible;

    // $FlowFixMe - ClientRect type is missing y property
    if (rect.y < wh && !currIsVisible) {
      this.setState({ isVisible: true });
    }

    // $FlowFixMe - ClientRect type is missing y property
    if (rect.y >= wh && currIsVisible) {
      this.setState({ isVisible: false });
    }
  };

  render() {
    const { children, className = "" } = this.props;
    const { isVisible } = this.state;
    return (
      <div
        ref={this.setElementRef}
        className={classnames(
          className,
          isVisible ? "isvisible" : "notvisible"
        )}
      >
        {children}
      </div>
    );
  }
}

// Set up a single shared event handler across all instances of this component.

const eventNames = ["scroll", "resize"];
let handlers = [];

function register(handler) {
  if (!window.addEventListener) {
    return;
  }
  if (handlers.length === 0) {
    eventNames.forEach(name =>
      window.addEventListener(name, onVisibilityChange)
    );
  }
  handlers.push(handler);
}

function unregister(handler) {
  if (!window.removeEventListener) {
    return;
  }
  handlers = handlers.filter(i => i !== handler);
  if (handlers.length === 0) {
    eventNames.forEach(name =>
      window.removeEventListener(name, onVisibilityChange)
    );
  }
}

let handlerIsPending = false;

function onVisibilityChange() {
  if (handlerIsPending) {
    return;
  }
  handlerIsPending = true;
  window.requestAnimationFrame(() => {
    handlers.forEach(handler => handler());
    handlerIsPending = false;
  });
}
