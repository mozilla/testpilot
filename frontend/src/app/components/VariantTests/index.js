// @flow

import React from "react";

type VariantTestCaseProps = {
  value: string,
  children: Array<any>
}

export class VariantTestCase extends React.Component {
  props: VariantTestCaseProps

  render() {
    return <span>{ this.props.children }</span>;
  }
}

export class VariantTestDefault extends React.Component {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

type VariantTestsProps = {
  name: string,
  varianttests: Object,
  children: Array<any>
}

export class VariantTests extends React.Component {
  props: VariantTestsProps

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
