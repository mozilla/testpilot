
import React from 'react';

export class VariantTestCase extends React.Component {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

VariantTestCase.propTypes = {
  value: React.PropTypes.string.isRequired
};

export class VariantTestDefault extends React.Component {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

export class VariantTests extends React.Component {
  render() {
    const testVariant = this.props.varianttests[this.props.name];
    if (testVariant === undefined) {
      return <div>
        Error: Test { JSON.stringify(this.props.name) } not found in tests.
        Provided tests: { JSON.stringify(Object.keys(this.props.varianttests)) }
      </div>;
    }
    if (this.props.children === undefined) {
      return <div>
        Error: VariantTests.props.children is undefined
      </div>;
    }
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

VariantTests.propTypes = {
  name: React.PropTypes.string.isRequired,
  varianttests: React.PropTypes.object.isRequired
};
