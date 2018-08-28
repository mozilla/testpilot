// @flow

import React, { Component } from "react";
import classnames from "classnames";

import "./index.scss";

type CopterProps = {
  small?: boolean,
  animation?: string
}

export default class Copter extends Component<CopterProps> {

  render() {
    const { small = false, animation = null } = this.props;
    return <div className={classnames("copter", { "copter--small": small })}>
      <div className={classnames("copter__inner", animation)} />
    </div>;
  }
}
