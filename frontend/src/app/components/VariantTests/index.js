// @flow

import React, { Component } from "react";

type VariantTestCaseProps = {
  value: string,
  children: Array<any>
}

export class VariantTestCase extends Component<VariantTestCaseProps> {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

type VariantTestDefaultProps = {
  children: Array<any>
}
export class VariantTestDefault extends Component<VariantTestDefaultProps> {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

type VariantTestsProps = {
  name: string,
  varianttests: Object,
  children: Array<any>,
  isExperimentEnabled: Function
}

export class VariantTests extends Component<VariantTestsProps> {
  render() {
    const testVariant = this.props.varianttests[this.props.name];
    let defaultElement = <span>
      Error: No matching variant and no VariantTestDefault provided
    </span>;
    for (const child of this.props.children) {
      if (child.type === VariantTestDefault) {
        defaultElement = child;
      }
      if (child.props.value === testVariant) {
        return child;
      }
    }
    return defaultElement;
  }
}
